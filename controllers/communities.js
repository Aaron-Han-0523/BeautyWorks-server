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
        if (req.api) {
            return res.status(201).json(result.id);
        } else {
            return res.status(201).redirect(codezip.url.users.community.main);
        }
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

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
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
    }

    communitiesService
        .update(body)
        .then(result => {
            if (result == 1) {
                if (req.api) {
                    return res.status(200).end();
                }
                else {
                    return res.redirect(codezip.url.users.community.main + '/' + id);
                }
            }
            else if (result == 0) {
                res.status(400).send("Nothing to update data.");
            }
        })
        .catch(err => {
            console.error(err);
            return res.json(`fail id:${id}`)
        });
}

exports.index = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];
    let word = req.query.q
    if (word) word = word.replace(/\;/g, '').trim();

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

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        condition.delete_date = null;
    }

    const communities_page = req.query.p || 1;
    console.log("page query :", communities_page)

    const limit = req.query.limit || 5;
    const skip = req.query.skip || (communities_page - 1) * limit;

    let communities_paging = {
        skip: skip,
        limit: limit
    }

    const communities = communitiesService
        .allRead(condition, communities_paging)
        .then(data => {
            console.log(data.rows.length);
            if (req.api) {
                return res.json({
                    communities: {
                        count: data.count,
                        page: communities_page,
                        word: word,
                        data: data.rows,
                    }
                })
            } else if (base == 'users') {

                return res.render('community/index', {
                    communities: {
                        count: data.count,
                        data: data.rows,
                        page: communities_page,
                        word: word
                    }
                })
            } else if (base == 'admin') {
                return res.render('admin/community/index', {
                    communities: {
                        count: data.count,
                        data: data.rows,
                        page: communities_page,
                        word: word
                    }
                })
            }

        }).catch(err => {
            console.error(err);
            res.status(500).end();
        });
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    console.log(`open one data id-${id}`)
    const reply_page = req.query.p || 1;
    const limit = req.query.limit || 5;
    const skip = req.query.skip || (reply_page - 1) * limit;

    const prev_id = communitiesService.getPrevID(id);
    const next_id = communitiesService.getNextID(id);
    const community = communitiesService.readOne(id);
    const communitylike_count = likeService.countLike(id);

    let reply_paging = {
        skip: skip,
        limit: limit
    }

    let condition = { communities_id: id };
    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        // condition.users_id = user.id;
        condition.delete_date = null;
    }

    const reply = repliesService.allRead(condition, reply_paging);


    Promise.all([community, communitylike_count, prev_id, next_id, reply])
        .then(async ([community, communitylike_count, prev_id, next_id, reply]) => {
            // console.log('??', reply)
            if (!community) {
                return next(createError(404));
            }

            const user = await usersService.readOne(community.users_id);
            community.first_name = user.first_name;
            community.last_name = user.last_name;
            if (req.api) {
                return res.json({
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
            } else if (base == 'users') {
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
            } else if (base == 'admin') {
                return res.render(`admin/community/detail`, {
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
            }

        })
        .catch(err => {
            console.error(err);
            return res.status(500).send(err);
        })
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    let community_result = communitiesService
        .delete(id)


    let reply_result = repliesService
        .delete({ communities_id: id })
    // console.log("delete result :", result)

    Promise.all([community_result, reply_result]).then(result => {
        if (result[0] == 1) {
            if (base == "users") {
                return res.redirect(codezip.url.users.community.main);
            } else {
                return res.status(200).end();
            }
        }
        else if (result[0] == 0) {
            return res.status(208).send("Nothing to delete data.");
        }
        else {
            throw new Error("Something to wrong!! check to news delete")
        }
    }).catch(err => {
        console.error(err);
        res.ststus(500).send(err)
    });
}

exports.like = async (req, res, next) => {
    const user = res.locals.user;
    // console.log(user);
    if (!user) {
        return res.status(403).redirect(codezip.url.users.signIn);
    }
    let body = Object.assign(req.body, { users_id: user.id });

    console.log(body);
    let result;
    if (body.is_like) {
        result = likeService.create(body);
    } else {
        result = likeService.delete(body);
    }

    result.then(result => {
        console.log(body);
        console.log(result);
        res.end()
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
}

exports.recovery = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = { id: id };

    await communitiesService
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