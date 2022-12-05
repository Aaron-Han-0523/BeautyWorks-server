const formulasService = require('../services/formulas');
const like_formulas = require('../services/like_formulas');

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let body = req.body;

    await formulasService
        .create(body)
        .then((created_obj) => {
            console.log(created_obj.id);
            res.status(201).json(created_obj.id);
        })
        .catch((err) => {
            console.log("fail to create formulas");
            console.log(body);
            console.error(err);
            res.status(500).end();
        });
}

exports.edit = async (req, res, next) => {
    const id = req.params.id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = { id: id };

    let body = req.body;

    await formulasService
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
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = { id: id };

    await formulasService
        .hide(condition)
        .then((result) => {
            if (result == 1) {
                // like_formulas
                //     .delete({ formulas_id: id })
                //     .then((cnt) => {
                //         console.log("like delete count:", cnt)
                //     })
                res.status(200).end();
            }
            else if (result === [0]) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to formulas delete")
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

    await formulasService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to formulas recovery")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}

exports.index = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];
    // console.log('base url', base);
    // console.log('user type', user);

    const page = req.query.p || 1;
    delete req.query.p;
    const limit = req.query.limit || 8;
    delete req.query.limit;
    const skip = (page - 1) * limit;

    delete req.query.n;
    let condition = {};
    for ([key, value] of Object.entries(req.query)) {
        if (value) {
            condition[key] = value;
        }
    }
    if (base != 'admin') {
        // condition.users_id = user.id;
        condition.delete_date = null;
    }

    console.log(condition)
    await formulasService
        .allRead(condition, limit, skip)
        .then((result) => {
            console.log("keys :", Object.keys(result))
            if (req.api) {
                console.log('complete')
                return res.json({
                    page: page,
                    limit: limit,
                    formulas: result
                })
            } else if (base == 'users') {
                return res.render('formula/index', {
                    page: page,
                    limit: limit,
                    formulas: result
                })
            } else if (base == 'admin') {
                return res.render('admin/formula/index', {
                    page: page,
                    limit: limit,
                    formulas: result
                })
            }
        })
        .catch((err) => {
            console.log("error");
            console.error(err);
            return res.status(500).end();
        })
}

exports.detail = async (req, res, next) => {
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    let condition = {};
    if (base != 'admin') {
        // condition.users_id = user.id;
        condition.delete_date = null;
    }
    condition.id = req.params.id;

    const like_list = like_formulas.getLikelist(user.id);

    const formula = formulasService.readOne(condition);


    Promise.all([formula, like_list]).then(([formula, like_list]) => {
        console.log(formula);
        console.log(like_list);

        let is_like = false;
        if (like_list && like_list.list && like_list.list.includes(formula.id)) is_like = true;

        if (req.api) {
            res.json({
                formula: formula
            })
        } else if (base == 'users') {
            res.render('formula/detail', {
                formula: formula,
                is_like: is_like,
            })
        } else if (base == 'admin') {
            res.render('admin/formula/detail', {
                formula: formula
            })
        }

    }).catch((err) => {
        console.error(err);
        res.status(500).end();
    })
}

exports.like = async (req, res, next) => {
    const user = res.locals.user;
    const id = +req.params.id;
    const like_list = await like_formulas.getLikelist(user.id);
    // console.log(like_list);
    // console.log(id);

    let condition = {
        formulas_id: id,
        users_id: user.id
    }

    let result = null;
    if (like_list && like_list.list && like_list.list.includes(id)) {
        result = like_formulas.delete(condition);
    } else {
        result = like_formulas.create(condition);
    }

    result.then(result => {
        console.log(result)
        res.end();
    }).catch(err => {
        console.error(err);
        res.status(500).end();
    })

}