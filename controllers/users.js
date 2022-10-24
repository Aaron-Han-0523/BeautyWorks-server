const usersService = require('../services/users');
const nodemailer = require('nodemailer');
const systemInfo = require('../config/system.json');
const encryption = require('../utils/encryption');
const Sequelize = require('sequelize');
const { __ } = require('i18n');
const Op = Sequelize.Op;

exports.login = async function (req, res, next) {
    const body = req.body;

    console.log(body)
    console.log("try", body.email, "login by", req.ip);

    const user = await usersService.getUser(body.email)
    // console.log(user)

    const hashedPassword = await encryption.hashing(body.password);
    // console.log("해싱된 패스워드", hashedPassword);
    // console.log("저장된 패스워드", user.password);

    if (user) {
        if (user.password == hashedPassword) {

            delete user.password;
            req.session.user = user

            //세션 스토어가 이루어진 후 redirect를 해야함.
            req.session.save(() => {
                res.redirect('/');
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
        return res.redirect('/users/signIn');
    })
}

exports.validationEmail = async (req, res, next) => {
    const targetEmail = req.body.email;
    // console.log(systemInfo);
    const transporter = nodemailer.createTransport({
        service: systemInfo.emailService,
        auth: {
            user: systemInfo.emailUserid,
            pass: systemInfo.emailPassword
        }
    });

    let validationNumber = ('000000' + parseInt((Math.random() * 1000000) / 1)).slice(-6);

    let mailOptions = {
        from: systemInfo.systemEmailName + '<' + systemInfo.emailUserid + '>',
        to: targetEmail,
        subject: __("users.signUp.validationMailTitle"),
        text: __("users.signUp.validationMailcontents") + '\n' + validationNumber
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
            return res.status(500).send(error);
        } else {
            console.log('Email sent: ' + info.response);
            return res.json(validationNumber);
        }
    });
}


exports.add = async (req, res, next) => {
    let body = req.body;
    body.password = await encryption.hashing(body.password);
    body.userType = 0;
    body.email = body.emailId + '@' + body.emailDomain;
    body.mobileContacts = "(" + body.country_number + ")" + body.phoneNum;
    console.log("Users body :", body);

    try {
        let result = await usersService.create(body);
        // console.log("result :",result);
        return res.status(201).redirect('/users/signIn');
    }
    catch (e) {
        console.error(e);
        return res.status(500).send(e);
    }
}

exports.edit = async (req, res, next) => {
    console.log("users edit")

    let user = req.session.user;
    // console.log('user :', user);

    let body = req.body;
    // console.log('body :', body);
    if (body.isRemoveImage == 'true') {
        body.profileImagePath = res.locals.codezip.url.users.defaultProfileImage.slice(1);
        console.log("default profile image path :", body.profileImagePath);
    } else {
        let file = req.file;
        // console.log('file :', file);
        if (file) body[file.fieldname] = file.path;
    }
    body = Object.assign(user, body);
    usersService
        .update(body)
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
    // let data = await usersService
    //     .allRead()
    //     .catch(err => console.error(err));

    // // console.log("data :", data);

    // return res.render('users/index', {
    //     count: data.count,
    //     data: data.rows,
    //     user: req.userInfo
    // });
}

exports.detail = async (req, res, next) => {
    // const id = req.params.id;
    // console.log(`open one data id-${id}`)

    // const user = req.userInfo;
    // let data = await usersService
    //     .readOne(id)
    //     .catch(err => console.error(err));

    // console.log("data :", data);

    // if (data) return res.render('users/detail', {
    //     user: user,
    //     data: data
    // });
    // else res.json(`fail id:${id}`)
    return res.send('My Account')
}

exports.delete = async (req, res, next) => {
    // const id = req.params.id;
    // const user = req.userInfo;

    // console.log('delete', id);

    // let obj = {};
    // obj.id = id;
    // obj.user = user.userid;

    // let result = await usersService
    //     .delete(obj)
    //     .catch(err => console.error(err));

    // // console.log("delete result :", result)

    // if (result) return res.redirect('/users');
    // else res.json(`fail id:${id}`)
}

exports.checkID = async (req, res, next) => {
    // let userid = req.body.userid;
    // // console.log(userid)
    // const user = await usersService.checkID(userid);
    // if (user) return res.status(409).json({ exist: true });
    // else return res.status(200).json({ exist: false });
}

exports.search = async (req, res, next) => {
    // const user = req.userInfo;
    // let word = req.query.q;
    // console.log("search", word, "start")

    // let result = null;
    // let condition = {};
    // try {
    //     if (word) {
    //         condition = {
    //             [Op.or]: [
    //                 { userName: { [Op.like]: `%${word}%` } }
    //             ]
    //         }
    //     }
    //     result = await usersService.allRead(condition);
    // } catch (err) {
    //     console.error(err)
    // }

    // console.log("search result :", result)

    // if (result) return res.status(200).json({ user: user, data: result });
    // else res.status(400).json(`don't find ${word}`)
}
