const communityService = require('../services/community');
const newsService = require('../services/news');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.add = async (req, res, next) => {
    const user = req.userInfo;
    let body = req.body;
    body.user = user.userid;
    console.log("community body :", body);

    try {
        let result = await communityService.create(body);
        // console.log("result :",result);
        return res.status(201).redirect('/community');
    }
    catch (e) {
        console.error(e);
        return res.status(409).json(`add fail`)
    }
}

exports.edit = async (req, res, next) => {
    console.log("put - community edit")
    const user = req.userInfo;
    const id = req.params.id;
    let body = req.body;
    body.user = user.userid;
    body.id = id;
    console.log("community body :", body);

    let result = await communityService
        .update(body)
        .catch(err => console.error(err));

    // console.log('result :', result)

    if (result) res.redirect(`/community/${id}`);
    else res.json(`fail id:${id}`)
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
        // console.log("community :", data[0][0].count);
        // console.log("news :", data[1].count);
        // console.log("data :", data);
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

    const user = req.userInfo;
    let data = await communityService
        .readOne(id)
        .catch(err => console.error(err));

    console.log("data :", data);

    if (data) return res.render(`community/detail`, {
        user: user,
        data: data
    });
    else res.status(404).json(`fail id:${id}`)
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    const user = req.userInfo;
    let obj = {};
    obj.id = id;
    obj.user = user.userid;

    let result = await communityService
        .delete(obj)
        .catch(err => console.error(err));

    // console.log("delete result :", result)

    if (result) return res.redirect('/community');
    else res.json(`fail id:${id}`)
}

exports.search = async (req, res, next) => {
    const user = req.userInfo;
    let word = req.query.q;
    console.log("search", word, "start")

    let result = null;
    try {
        if (word) {
            result = await communityService.allRead({
                [Op.or]: [
                    { title: { [Op.like]: `%${word}%` } },
                    { content: { [Op.like]: `%${word}%` } }
                ]
            })
        } else {
            result = await communityService.allRead()
        }
    } catch (err) {
        console.error(err)
    }

    console.log("search result :", result)

    if (result) return res.status(200).json({ user: user, data: result });
    else res.status(400).json(`don't find ${word}`)
}