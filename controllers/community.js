const models = require('../models');
const usersService = require('../services/users');
const communityService = require('../services/community');
const likeService = require('../services/like_community');
const replyService = require('../services/community_reply');
const newsService = require('../services/news');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    let body = req.body;
    body.users_id = user.users_id;
    console.log("community body :", body);

    try {
        let result = await communityService.create(body);
        // console.log("result :",result);
        return res.status(201).redirect(res.locals.codezip.url.users.community.main);
    }
    catch (e) {
        console.error(e);
        return res.status(409).json(`add fail`)
    }
}

exports.edit = async (req, res, next) => {
    console.log("put - community edit")
    const user = res.locals.user;
    const id = req.params.id;
    let body = req.body;
    body.id = id;
    console.log("community body :", body);

    const checkAuthor = await communityService.readOne(id).then(result => {
        if (result.users_id != user.users_id) { return false; }
        else { return true; }
    }).catch(err => {
        console.error(err);
        throw res.status(500).send(err);
    })
    // console.log(checkAuthor);
    if (!checkAuthor) {
        return res.status(403).end();
    }

    communityService
        .update(body)
        .then(result => {
            return res.redirect(res.locals.codezip.url.users.community.main + '/' + id);
        })
        .catch(err => {
            console.error(err);
            return res.json(`fail id:${id}`)
        });
}

exports.index = async (req, res, next) => {
    const news_page = req.query.np || 1;
    const community_page = req.query.cp || 1;
    console.log("page query :", news_page, community_page)

    let word = req.query.q
    if (word) word = word.replace(';', '').trim();
    const skip = req.query.skip;
    const limit = req.query.limit;

    let news_paging = {
        skip: skip ? skip : (news_page - 1) * 4,
        limit: limit ? limit : 4
    }
    let community_paging = {
        skip: skip ? skip : (community_page - 1) * 4,
        limit: limit ? limit : 4
    }
    let condition = word ?
        // {
        //     [Op.or]: [
        //         { title: { [Op.like]: `%${word}%` } },
        //         { content: { [Op.like]: `%${word}%` } }
        //     ]
        // }
        {
            word: word
        }
        : {}

    const community = communityService
        .allRead(condition, community_paging)
        .catch(err => console.error(err));

    const news = newsService
        .allRead(condition, news_paging)
        .catch(err => console.error(err));

    Promise.all([community, news]).then(data => {
        return res.render('community/index', {
            community: {
                count: data[0][0].count,
                data: data[0][1],
                page: community_page,
                word: word
            },
            news: {
                count: data[1][0].count,
                data: data[1][1],
                page: news_page,
                word: word
            }
        });
    })
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    console.log(`open one data id-${id}`)
    const reply_page = req.query.rp || 1;
    const skip = req.query.skip;
    const limit = req.query.limit;

    const prev_id = communityService.getPrevID(id);
    const next_id = communityService.getNextID(id);
    const community = communityService.readOne(id);
    const communityLikeCount = likeService.countLike(id);

    let reply_paging = {
        skip: skip ? skip : (reply_page - 1) * 4,
        limit: limit ? limit : 4
    }
    const reply = replyService.allRead({ id: id }, reply_paging);


    Promise.all([community, communityLikeCount, prev_id, next_id, reply])
        .then(async ([community, communityLike, prev_id, next_id, reply]) => {
            // console.log('??', reply)

            const user = await usersService.readOne(community.users_id);
            community.firstName = user.firstName;
            community.lastName = user.lastName;
            // return res.json({
            //     author: { users_id: user.users_id },
            //     community: community,
            //     communityLike: communityLike,
            //     prev: prev_id[0] || null,
            //     next: next_id[0] || null,
            //     reply: {
            //         count: reply[0].count,
            //         data: reply[1],
            //         page: reply_page,
            //         word: word
            //     }
            // });
            return res.render(`community/detail`, {
                originalUrl: req.originalUrl.split('?')[0],
                community: community,
                communityLike: communityLike,
                prev: prev_id[0] || null,
                next: next_id[0] || null,
                reply: {
                    count: reply[0],
                    data: reply[1],
                    page: reply_page,
                }
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send(err);
        })
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;

    let result = await communityService
        .delete(id)
        .catch(err => {
            console.error(err);
            res.ststus(500).send(err)
        });

    // console.log("delete result :", result)

    if (result) return res.redirect(res.locals.codezip.url.users.community.main);
    else res.ststus(500).send(`fail id:${id}`)
}

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

// exports.search = async (req, res, next) => {
//     const user = req.userInfo;
//     let word = req.query.q;
//     console.log("search", word, "start")

//     let result = null;
//     try {
//         if (word) {
//             result = await communityService.allRead({
//                 [Op.or]: [
//                     { title: { [Op.like]: `%${word}%` } },
//                     { content: { [Op.like]: `%${word}%` } }
//                 ]
//             })
//         } else {
//             result = await communityService.allRead()
//         }
//     } catch (err) {
//         console.error(err)
//     }

//     console.log("search result :", result)

//     if (result) return res.status(200).json({ user: user, data: result });
//     else res.status(400).json(`don't find ${word}`)
// }