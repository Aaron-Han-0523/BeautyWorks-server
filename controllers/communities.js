const models = require('../models');
const codezip = require('../codezip');
const usersService = require('../services/users');
const communitiesService = require('../services/communities');
const likeService = require('../services/like_communities');
const repliesService = require('../services/replies');
const newsService = require('../services/news');
const { Op } = require('sequelize');

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    let body = req.body;
    body.users_id = user.id;
    console.log("communities body :", body);

    try {
        let result = await communitiesService.create(body);
        // console.log("result :",result);
        return res.status(201).redirect(codezip.url.users.communities.main);
    }
    catch (e) {
        console.error(e);
        return res.status(409).json(`add fail`)
    }
}

exports.edit = async (req, res, next) => {
    console.log("put - communities edit")
    const user = res.locals.user;
    const id = req.params.id;
    let body = req.body;
    body.id = id;
    console.log("communities body :", body);

    const checkAuthor = await communitiesService.readOne(id).then(result => {
        if (result.users_id != user.id) { return false; }
        else { return true; }
    }).catch(err => {
        console.error(err);
        throw res.status(500).send(err);
    })
    // console.log(checkAuthor);
    if (!checkAuthor) {
        return res.status(403).end();
    }

    communitiesService
        .update(body)
        .then(result => {
            return res.redirect(codezip.url.users.communities.main + '/' + id);
        })
        .catch(err => {
            console.error(err);
            return res.json(`fail id:${id}`)
        });
}

exports.index = async (req, res, next) => {
    const news_page = req.query.np || 1;
    const communities_page = req.query.cp || 1;
    console.log("page query :", news_page, communities_page)

    let word = req.query.q
    if (word) word = word.replace(/\;/g, '').trim();
    const skip = req.query.skip;
    const limit = req.query.limit;

    let news_paging = {
        skip: skip ? skip : (news_page - 1) * 4,
        limit: limit ? limit : 4
    }
    let communities_paging = {
        skip: skip ? skip : (communities_page - 1) * 4,
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

    const communities = communitiesService
        .allRead(condition, communities_paging)
        .catch(err => console.error(err));

    const news = newsService
        .allRead(condition, news_paging)
        .catch(err => console.error(err));

    Promise.all([communities, news]).then(data => {
        return res.render('community/index', {
            communities: {
                count: data[0][0].count,
                data: data[0][1],
                page: communities_page,
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

    const prev_id = communitiesService.getPrevID(id);
    const next_id = communitiesService.getNextID(id);
    const community = communitiesService.readOne(id);
    const communitylike_count = likeService.countLike(id);

    let reply_paging = {
        skip: skip ? skip : (reply_page - 1) * 4,
        limit: limit ? limit : 4
    }
    const reply = repliesService.allRead({ id: id }, reply_paging);


    Promise.all([community, communitylike_count, prev_id, next_id, reply])
        .then(async ([community, communitylike_count, prev_id, next_id, reply]) => {
            // console.log('??', reply)

            const user = await usersService.readOne(community.users_id);
            community.first_name = user.first_name;
            community.last_name = user.last_name;
            // return res.json({
            //     author: { users_id: user.id },
            //     communities: communities,
            //     communitiesLike: communitiesLike,
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
                communityLike: communitylike_count,
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

    let result = await communitiesService
        .delete(id)
        .catch(err => {
            console.error(err);
            res.ststus(500).send(err)
        });

    // console.log("delete result :", result)

    if (result) return res.redirect(codezip.url.users.communities.main);
    else res.ststus(500).send(`fail id:${id}`)
}

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

// exports.search = async (req, res, next) => {
//     const user = req.userInfo;
//     let word = req.query.q;
//     console.log("search", word, "start")

//     let result = null;
//     try {
//         if (word) {
//             result = await communitiesService.allRead({
//                 [Op.or]: [
//                     { title: { [Op.like]: `%${word}%` } },
//                     { content: { [Op.like]: `%${word}%` } }
//                 ]
//             })
//         } else {
//             result = await communitiesService.allRead()
//         }
//     } catch (err) {
//         console.error(err)
//     }

//     console.log("search result :", result)

//     if (result) return res.status(200).json({ user: user, data: result });
//     else res.status(400).json(`don't find ${word}`)
// }