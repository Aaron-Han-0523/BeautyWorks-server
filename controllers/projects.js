const projectsService = require('../services/projects');

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    let body = req.body;
    body.users_id = user.id;

    body.id = await projectsService.maxId({ users_id: user.id }).then(result => {
        // console.log("max id :", result);
        if (result === null) {
            return 1;
        } else {
            return result + 1;
        }
    });

    await projectsService
        .create(body)
        .then((created_obj) => {
            res.stutus(201).send(created_obj.id);
        })
        .catch((err) => {
            console.log("fail to create projects");
            console.log(body);
            console.error(err);
            res.stutus(500).end();
        });
}

exports.edit = async (req, res, next) => {
    const id = req.params.id;
    let condition = { id: id };

    let body = req.body;

    await projectsService
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

    await projectsService
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

    await projectsService
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
        condition.users_id = user.users_id;
        condition.delete_date = null;
    }
    let limit = req.query.limit;
    let skip = req.query.skip;

    await projectsService
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
    if ([1].includes(user.user_type)) {
        condition.users_id = user.users_id;
        condition.delete_date = null;
    }

    await projectsService
        .readOne(condition)
        .then((result) => {
            console.log("find :", result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}