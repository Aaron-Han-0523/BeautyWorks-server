const models = require('../models');
const usersService = require('../services/users');
const newsService = require('../services/news');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.add = async (req, res, next) => {
    // const user = req.userInfo;
    // let body = req.body;
    // body.user = user.userid;
    // console.log("news body :", body);

    // try {
    //     let result = await newsService.create(body);
    //     // console.log("result :",result);
    //     return res.status(201).redirect('/news');
    // }
    // catch (e) {
    //     console.error(e);
    //     return res.status(409).json(`add fail`)
    // }
}

exports.edit = async (req, res, next) => {
    //     console.log("put - news edit")
    //     const user = req.userInfo;
    //     const id = req.params.id;
    //     let body = req.body;
    //     body.user = user.userid;
    //     body.id = id;
    //     console.log("news body :", body);

    //     let result = await newsService
    //         .update(body)
    //         .catch(err => console.error(err));

    //     // console.log('result :', result)

    //     if (result) res.redirect(`/news/${id}`);
    //     else res.json(`fail id:${id}`)
}

exports.index = async (req, res, next) => {
    const news_page = req.query.p || 1;
    //    const communities_page = req.query.cp || 1;
    //    console.log("page query :", news_page, communities_page)

    let word = req.query.q
    if (word) word = word.replace(/\;/g, '').trim();
    const limit = req.query.limit || 5;
    const skip = req.query.skip || (news_page - 1) * limit;

    let news_paging = {
        skip: skip,
        limit: limit
    }
    //    let communities_paging = {
    //        skip: skip ? skip : (communities_page - 1) * 4,
    //        limit: limit ? limit : 4
    //    }
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

    //    const communities = communitiesService
    //        .allRead(condition, communities_paging)
    //        .catch(err => console.error(err));

    const news = newsService
        .allRead(condition, news_paging)
        .catch(err => console.error(err));

    Promise.all([news]).then(data => {
        return res.render('news/index', {
            //            communities: {
            //                count: data[0][0].count,
            //                data: data[0][1],
            //                page: communities_page,
            //                word: word
            //            },
            news: {
                count: data[0][0].count,
                data: data[0][1],
                page: news_page,
                word: word
            }
        });
    })
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    console.log(`open one data id-${id}`)

    const prev_id = newsService.getPrevID(id);
    const next_id = newsService.getNextID(id);

    const data = newsService.readOne(id);

    Promise.all([data, prev_id, next_id])
        .then(async ([data, prev_id, next_id]) => {
            console.log("data :", [data, prev_id, next_id]);
            // console.log("prev_id :", results[1][0]);
            // console.log("next_id :", results[2][0]);
            const user = await usersService.readOne(data.users_id);
            console.log(user)
            data.first_name = user.first_name;
            data.last_name = user.last_name;
            return res.render(`news/detail`, {
                news: data,
                prev: prev_id[0] || null,
                next: next_id[0] || null,
            })
        })
}

exports.delete = async (req, res, next) => {
    //     const id = req.params.id;
    //     const user = req.userInfo;
    //     let obj = {};
    //     obj.id = id;
    //     obj.user = user.userid;

    //     let result = await newsService
    //         .delete(obj)
    //         .catch(err => console.error(err));

    //     // console.log("delete result :", result)

    //     if (result) return res.redirect('/news');
    //     else res.json(`fail id:${id}`)
    // }

    // exports.search = async (req, res, next) => {
    //     const user = req.userInfo;
    //     let word = req.query.q;
    //     console.log("search", word, "start")

    //     let result = null;
    //     try {
    //         if (word) {
    //             result = await newsService.allRead({
    //                 [Op.or]: [
    //                     { title: { [Op.like]: `%${word}%` } },
    //                     { content: { [Op.like]: `%${word}%` } }
    //                 ]
    //             })
    //         } else {
    //             result = await newsService.allRead()
    //         }
    //     } catch (err) {
    //         console.error(err)
    //     }

    //     console.log("search result :", result)

    //     if (result) return res.status(200).json({ user: user, data: result });
    //     else res.status(400).json(`don't find ${word}`)
}