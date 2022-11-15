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
//     const page = req.query.p ? req.query.p : 1;
//     const word = req.query.q;
//     const skip = req.query.skip;
//     const limit = req.query.limit;

//     let paging = {
//         skip: skip ? skip : (page - 1) * 10,
//         limit: limit ? limit : 10
//     }
//     let condition = word ?
//         {
//             [Op.or]: [
//                 { title: { [Op.like]: `%${word}%` } },
//                 { content: { [Op.like]: `%${word}%` } }
//             ]
//         }
//         : {}

//     const data = await newsService
//         .allRead(condition, paging)
//         .catch(err => console.error(err));

//     // console.log("data :", data);

//     return res.render('news/index', {
//         count: data.count,
//         data: data.rows,
//         user: req.userInfo,
//         page: page,
//         word: word
//     });
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
                data: data,
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