const documentsService = require('../services/documents');
const projectsService = require('../services/projects');


exports.add = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let body = req.body;

    await documentsService
        .create(body)
        .then((created_obj) => {
            res.status(201).json(created_obj.id);
        })
        .catch((err) => {
            console.log("fail to create documents");
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

    await documentsService
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
            console.error(err);
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

    await documentsService
        .hide(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to document delete")
            }
        })
        .catch((err) => {
            console.error(err);
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

    await documentsService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to document recovery")
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}


exports.index = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    const page = +req.query.p || 1;
    delete req.query.p;
    const limit = +req.query.limit || 10;
    delete req.query.limit;
    const skip = (page - 1) * limit;

    delete req.query.n;

    console.log('api', req.query)

    let condition = { users_id: user.id };

    if (base != 'admin') {
        condition.delete_date = null;
    }

    console.log(condition)

    await projectsService
        .allRead(condition, limit, skip)
        .then((result) => {
            console.log("keys :", Object.keys(result))
            console.log((result))
            if (req.api) {
                return res.json({
                    page: page,
                    limit: limit,
                    documents: result
                })
            } else if (base == 'users') {
                return res.render('documents/index', {
                    page: page,
                    limit: limit,
                    documents: result
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
    } else {
        condition.users_id = req.query.users_id;
    }

    condition.id = req.params.id;

    await projectsService
        .readOne(condition)
        .then((result) => {
            console.log("find :", result);
            if (req.api) {
                res.json({
                    document: result
                })
            } else if (base == 'users') {
                res.render('documents/detail', {
                    project: result,
                })
            }
        }).catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}