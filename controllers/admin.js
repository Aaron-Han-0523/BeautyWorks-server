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

    const user = await usersService.getUser(body.email)
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
