const models = require('../models');
const replyService = require('../services/community_reply');
const likeService = require('../services/like_reply');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.add = async (req, res, next) => {
    let body = req.body;
    body.community_id = req.params.id;
    body.users_id = res.locals.user.users_id;
    console.log("reply body :", body);
    console.log("referer :", req.headers.referer);

    await replyService.create(body)
        .then(result => {
            console.log(result);
            return res.redirect(req.headers.referer.split('?')[0])
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send(err);
        })
}

exports.edit = async (req, res, next) => {
    console.log("reply edit");
    const user = res.locals.user;
    let body = req.body;
    const target = await replyService.readOne(body);
    // console.log(target);
    if (user.users_id != target.users_id) {
        return res.status(403).end();
    }
    console.log("reply edit body :", body);

    replyService.update(body)
        .then(result => {
            console.log(result);
            return res.end();
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send(err);
        });
}

exports.delete = async (req, res, next) => {
    console.log("reply delete");
    const user = res.locals.user;
    let obj = {}
    obj.community_id = req.params.community_id;
    obj.reply_id = req.params.reply_id;
    //console.log(obj)
    const target = await replyService.readOne(obj);
    if (user.users_id != target.users_id) {
        return res.status(403).end();
    }

    let result = await replyService
        .delete(obj)
        .then(result => {
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
}

// exports.search = async (req, res, next) => {
//     const user = req.userInfo;
//     let word = req.query.q;
//     console.log("search", word, "start")

//     let result = null;
//     try {
//         if (word) {
//             result = await replyService.allRead({
//                 [Op.or]: [
//                     { title: { [Op.like]: `%${word}%` } },
//                     { content: { [Op.like]: `%${word}%` } }
//                 ]
//             })
//         } else {
//             result = await replyService.allRead()
//         }
//     } catch (err) {
//         console.error(err)
//     }

//     console.log("search result :", result)

//     if (result) return res.status(200).json({ user: user, data: result });
//     else res.status(400).json(`don't find ${word}`)
// }

exports.like = async (req, res, next) => {
    const user = res.locals.user;
    // console.log(user);
    if (!user) {
        return res.status(403).redirect(res.locals.codezip.url.users.signIn);
    }
    let body = Object.assign(req.body, user);

    // console.log(body);
    let result;
    if (body.is_like) {
        result = likeService.create(body);
    } else {
        result = likeService.delete(body);
    }

    result.then(result => {
        // console.log(body);
        // console.log(result);
        res.end()
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
}