var createError = require('http-errors');
const codezip = require('../codezip');
const models = require('../models');
const usersService = require('../services/users');
const newsService = require('../services/news');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let body = req.body;
    body.users_id = user.id;
    console.log("news body :", body);

    try {
        let result = await newsService.create(body);
        // console.log("result :",result);
        if (req.api) {
            return res.status(201).json(result.id);
        } else {
            return res.status(201).redirect(codezip.url.admin.news.main);
        }
    }
    catch (e) {
        console.error(e);
        return res.status(409).json(`add fail`)
    }
}

exports.edit = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let body = req.body;
    body.users_id = user.id;
    console.log("news body :", body);

    let condition = { id: req.params.id };
    await newsService
        .update(body, condition)
        .then((result) => {
            if (result == 1) {
                if (req.api) {
                    return res.status(200).end();
                }
                else {
                    return res.redirect(codezip.url.admin.news.main + `/${id}`);
                }
            }
            else if (result == 0) {
                res.status(400).send("Nothing to update data.");
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.index = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    const news_page = +req.query.p || 1;
    let limit = +req.query.limit || 10;
    const skip = req.query.skip || (news_page - 1) * limit;

    let news_paging = {
        skip: skip,
        limit: limit
    }

    let word = req.query.q;
    if (word) word = word.replace(/\;/g, '').trim();

    let condition = word ?
        {
            word: word
        }
        : {}

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        condition.delete_date = null;
        limit = +req.query.limit || 5;
    }

    console.log("where", condition);

    const news = newsService
        .allRead(condition, news_paging)
        .then(data => {
            console.log(data.rows.length);
            if (req.api) {
                return res.json({
                    news: {
                        count: data.count,
                        data: data.rows,
                        page: news_page,
                        word: word
                    }
                })
            } else if (base == 'users') {
                return res.render('news/index', {
                    news: {
                        count: data.count,
                        page: news_page,
                        word: word,
                        data: data.rows
                    }
                })
            } else if (base == 'admin') {
                return res.render('admin/news/index', {
                    news: {
                        count: data.count,
                        rows: data.rows
                    },
                    word: word,
                    page: news_page,
                })
            }
        }).catch(err => {
            console.error(err)
        });
}

exports.detail = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    let condition = { id: id };
    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        condition.delete_date = null;
    }

    console.log(`open one data id-${id}`)

    const prev_id = newsService.getPrevID(id);
    const next_id = newsService.getNextID(id);

    const data = newsService.readOne(condition);

    Promise.all([data, prev_id, next_id])
        .then(async ([data, prev_id, next_id]) => {
            console.log("data :", [data, prev_id, next_id]);
            // console.log("prev_id :", results[1][0]);
            // console.log("next_id :", results[2][0]);

            if (!data) {
                return next(createError(404));
            }

            const user = await usersService.readOne(data.users_id);
            console.log(user)
            data.first_name = user.first_name;
            data.last_name = user.last_name;
            if (req.api) {
                return res.json({
                    news: data,
                    prev: prev_id[0] || null,
                    next: next_id[0] || null,
                });
            } else if (base == 'users') {
                return res.render(`news/detail`, {
                    news: data,
                    prev: prev_id[0] || null,
                    next: next_id[0] || null,
                })
            } else if (base == 'admin') {
                return res.render(`admin/news/detail`, {
                    news: data,
                    prev: prev_id[0] || null,
                    next: next_id[0] || null,
                })
            }
        })
}

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = { id: id };

    await newsService
        .hide(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result === [0]) {
                res.status(208).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to news delete")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.recovery = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = { id: id };

    await newsService
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