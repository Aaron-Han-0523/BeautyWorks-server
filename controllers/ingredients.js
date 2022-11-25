const ingredientsService = require('../services/ingredients');
const { Op } = require('sequelize');

exports.add = async (req, res, next) => {
    let body = req.body;

    await ingredientsService
        .create(body)
        .then((created_obj) => {
            res.stutus(201).send(created_obj.id);
        })
        .catch((err) => {
            console.log("fail to create ingredients");
            console.log(body);
            console.error(err);
            res.stutus(500).end();
        });
}

exports.edit = async (req, res, next) => {
    const id = req.params.id;
    let condition = { id: id };

    let body = req.body;

    await ingredientsService
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
    const id = req.params.id;
    let condition = { id: id };

    await ingredientsService
        .hide(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to project delete")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.recovery = async (req, res, next) => {
    const id = req.params.id;
    let condition = { id: id };

    await ingredientsService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to project recovery")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.index = async (req, res, next) => {
    const user = res.locals.user;

    const page = req.query.p || 1;
    delete req.query.p;
    const limit = req.query.limit || 10;
    delete req.query.limit;
    const skip = (page - 1) * limit;

    delete req.query.n;

    console.log('api', req.query)

    let condition = {};
    for ([key, value] of Object.entries(req.query)) {
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
    console.log(condition)
    if (req.baseUrl.split('/')[1] != 'admin') {
        // condition.users_id = user.id;
        condition.delete_date = null;
    }

    await ingredientsService
        .allRead(condition, limit, skip)
        .then((result) => {
            console.log("keys :", Object.keys(result))
            if (req.api) {
                res.json({
                    page: page,
                    limit: limit,
                    ingredients: result
                })
            } else {
                res.render('ingredient/index', {
                    page: page,
                    limit: limit,
                    ingredients: result
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

    let condition = {};
    if (req.baseUrl.split('/')[1] != 'admin') {
        condition.users_id = user.id;
        condition.delete_date = null;
    }

    await ingredientsService
        .readOne(condition)
        .then((result) => {
            console.log("find :", result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}