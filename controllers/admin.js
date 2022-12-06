const usersService = require('../services/users');
const projectsService = require('../services/projects');
const formulasService = require('../services/formulas');
const like_formulasService = require('../services/like_formulas');
const ingredientsService = require('../services/ingredients');
const newsService = require('../services/news');
const communitiesService = require('../services/communities');
const like_communitiesService = require('../services/like_communities');
const like_repliesService = require('../services/like_replies');
const nodemailer = require('nodemailer');
const systemInfo = require('../config/system.json');
const encryption = require('../utils/encryption');
const { getRandomInt } = require('../utils/myUtils');
const { Op } = require('sequelize');
const codezip = require('../codezip');

exports.login = async function (req, res, next) {
    const body = req.body;

    // console.log(body)
    console.log("try", body.email, "login by", req.ip);

    const user = await usersService.getUser({ email: body.email, delete_date: null })
    // console.log(user)

    const hashedPassword = await encryption.hashing(body.password);
    // console.log("해싱된 패스워드", hashedPassword);
    // console.log("저장된 패스워드", user.password);

    if (user && [100, 200].includes(user.user_type)) {
        if (user.password == hashedPassword) {
            console.log(body.email, "connect");
            delete user.password;
            req.session.user = user;

            //세션 스토어가 이루어진 후 redirect를 해야함.
            req.session.save(() => {
                return res.redirect('/admin/users');
            });
        } else {
            console.log('비밀번호 불일치')
            return res.send(`<script> alert("아이디와 비밀번호를 확인해주세요."); location.href = document.referrer; </script>`)
        }
    } else {
        console.log('아이디 없음')
        return res.send(`<script> alert("아이디와 비밀번호를 확인해주세요."); location.href = document.referrer; </script>`)
    }
}

exports.logout = async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("로그아웃 : 세션 삭제 실패");
            return res.status(500).end();
        }
        console.log("세션 삭제 완료");
        return res.redirect('/admin/login');
    })
}

exports.checkEmail = async (req, res, next) => {
    const body = req.body;
    const user = await usersService.getUser({ email: body.email });

    if (user) {
        res.status(403).end()
    } else {
        res.status(200).end()
    }
}


exports.detail = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    const id = req.params.id;
    console.log(`open one data id-${id}`)

    usersService.readOne({ id: id })
        .then(result => {
            if (req.api) {
                return res.json(result);
            } else {
                return res.render("admin/users/detail", { client: result })
            }
        })
        .catch(err => {
            console.error(err)
            return res.status(500).end()
        });
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    usersService
        .hide({ id: id })
        .then(result => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result === [0]) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to users delete")
            }
        })
        .catch(err => console.error(err));
}

exports.recovery = async (req, res, next) => {
    const id = req.params.id;

    let condition = { id: id };

    usersService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to users recovery")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.edit = async (req, res, next) => {
    console.log("users edit")
    const id = req.params.id;

    let body = req.body;
    delete body.password;
    if (body.isRemoveImage == 'true') {
        body.profile_image_path = codezip.url.users.defaultProfileImage;
        console.log("default profile image path :", body.profile_image_path);
    } else {
        let file = req.file;
        // console.log('file :', file);
        if (file) body[file.fieldname] = '/' + file.path;
    }

    usersService
        .update(body, { id: id })
        .then(result => {
            console.log("update result :", result);
            return res.end()
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send();
        });
}


exports.index = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    const page = req.query.p || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    let condition = {
        id: { [Op.ne]: 1 },
    }

    usersService
        .allRead(condition, limit, skip)
        .then(result => {
            if (req.api) {
                return res.json({
                    users: result,
                    page: page,
                })
            } else if (base == 'admin') {
                return res.render("admin/users/index", {
                    users: result,
                    page: page,
                })
            }
        }).catch(err => {
            console.error(err);
            return res.status(500).end();
        })
}