const repliesService = require('../services/replies');
const likeService = require('../services/like_replies');
const models = require('../models');
const codezip = require('../codezip');
const { Op } = require('sequelize');

exports.add = async (req, res, next) => {
    let body = req.body;
    body.communities_id = req.params.id;
    body.users_id = res.locals.user.id;
    console.log("reply body :", body);
    console.log("referer :", req.headers.referer);

    await repliesService.create(body)
        .then(result => {
            if (req.api) {
                return res.json(result.id);
            } else {
                return res.redirect("back")
            }
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
    const target = await repliesService.readOne(body);
    // console.log(target);
    if (!(user.id == target.users_id || [100, 200].includes(user.user_type))) {
        return res.status(403).end();
    }
    console.log("reply edit body :", body);

    repliesService.update(body)
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
    obj.communities_id = req.params.community_id;
    obj.id = req.params.reply_id;
    //console.log(obj)
    const target = await repliesService.readOne(obj);
    if (user.id != target.users_id) {
        return res.status(403).end();
    }

    let result = await repliesService
        .hide(obj)
        .then(result => {
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
}

exports.recovery = async (req, res, next) => {
    const communities_id = req.params.community_id;
    const id = req.params.reply_id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = {
        communities_id: communities_id,
        id: id
    };

    await repliesService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to news recovery")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

// exports.search = async (req, res, next) => {
//     const user = req.userInfo;
//     let word = req.query.q;
//     console.log("search", word, "start")

//     let result = null;
//     try {
//         if (word) {
//             result = await repliesService.allRead({
//                 [Op.or]: [
//                     { title: { [Op.like]: `%${word}%` } },
//                     { content: { [Op.like]: `%${word}%` } }
//                 ]
//             })
//         } else {
//             result = await repliesService.allRead()
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
        return res.status(403).redirect(codezip.url.users.signIn);
    }
    let body = Object.assign(req.body, { users_id: user.id });

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