const packagesService = require('../services/packages');
const { Op } = require('sequelize');

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let body = req.body;

    await packagesService
        .create(body)
        .then((created_obj) => {
            res.status(201).json(created_obj.id);
        })
        .catch((err) => {
            console.log("fail to create packages");
            console.log(body);
            console.error(err);
            res.status(500).end();
        });
}

exports.edit = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    const id = req.params.id;
    let condition = { id: id };

    let body = req.body;

    await packagesService
        .update(body, condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to update data.");
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.delete = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    const id = req.params.id;
    let condition = { id: id };

    await packagesService
        .hide(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to packaging delete")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.recovery = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    const id = req.params.id;
    let condition = { id: id };

    await packagesService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to packaging recovery")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.index = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    let condition = {};

    let word = req.query.q;
    if (word) condition.packaging_name = { [Op.substring]: word };

    const page = +req.query.p || 1;
    let limit = +req.query.limit || 10;

    if (base != 'admin') {
        condition.delete_date = null;
        limit = +req.query.limit || 6;
    }

    const skip = (page - 1) * limit;

    delete req.query.n;
    delete req.query.q;
    delete req.query.p;
    delete req.query.limit;
    for ([key, value] of Object.entries(req.query)) {
        if (value) {
            // condition[key] = { [Op.substring]: value }; // 배열은 in 연산
            if (typeof value === "string") {
                condition[key] = { [Op.substring]: value }
            } else {
                condition[Op.or] = [];
                value.forEach((code, index) => {
                    condition[Op.or].push({ [key]: { [Op.substring]: code } })
                });
            }
        }
    }

    console.log(condition)

    await packagesService
        .allRead(condition, limit, skip)
        .then((result) => {
            console.log("keys :", Object.keys(result))
            if (req.api) {
                return res.json({
                    page: page,
                    limit: limit,
                    packages: result,
                    word: word
                })
            } else if (base == 'users') {
                return res.render('packaging/index', {
                    page: page,
                    limit: limit,
                    packages: result,
                    word: word
                })
            } else if (base == 'admin') {
                return res.render('admin/packaging/index', {
                    page: page,
                    limit: limit,
                    packages: result,
                    word: word
                })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}

exports.detail = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    let condition = {};
    if (base != 'admin') {
        condition.users_id = user.id;
        condition.delete_date = null;
    }

    condition.id = req.params.id;

    await packagesService
        .readOne(condition)
        .then((result) => {
            console.log("find :", result);
            if (req.api) {
                res.json({
                    ingredient: result
                })
            } else if (base == 'users') {
                res.render('ingredient/detail', {
                    ingredient: result,
                })
            } else if (base == 'admin') {
                res.render('admin/ingredient/detail', {
                    ingredient: result
                })
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}