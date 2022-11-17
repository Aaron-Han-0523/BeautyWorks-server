const ingredientsService = require('../services/ingredients');

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

    let condition = {};
    if ([1].indexOf(user.user_type) == -1) {
        condition.users_id = user.id;
        condition.delete_date = null;
    }
    let limit = req.query.limit;
    let skip = req.query.skip;

    await ingredientsService
        .allRead(condition, limit, skip)
        .then((result) => {
            console.log("keys :", Object.keys(result))
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}

exports.detail = async (req, res, next) => {
    const user = res.locals.user;

    let condition = {};
    if ([1].indexOf(user.user_type) == -1) {
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