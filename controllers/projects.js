const projectsService = require('../services/projects');
const myUtils = require('../utils/myUtils');
const { Op } = require('sequelize');

exports.add = async (req, res, next) => {
    const user = res.locals.user;
    let body = req.body;
    body.users_id = user.id;

    const id = req.query.n;
    console.log(req.query);
    if (id) {
        body.id = id;
    } else {
        body.project_name = "New Project - " + myUtils.formatDateTime(new Date);
        body.brand_name = user.brand_name;
        body.id = await projectsService.maxId({ users_id: user.id }).then(result => {
            // console.log("max id :", result);
            if (result === null) {
                return 1;
            } else {
                return result + 1;
            }
        });
    }
    console.log(body);

    await projectsService
        .upsert(body)
        .then((created_obj) => {
            res.status(201).json(created_obj.id);
        })
        .catch((err) => {
            console.log("fail to create projects");
            console.log(body);
            console.error(err);
            res.status(500).end();
        });
}

exports.edit = async (req, res, next) => {
    console.log("Project edit");

    const user = res.locals.user;
    const id = req.query.n || req.params.id;
    if (!id) return;

    let condition = { id: id };
    if (req.baseUrl.split('/')[1] == 'users') {
        condition.users_id = user.id;
        let project = await projectsService.readOne(condition);
        if ([0].includes(project.phase) && project.detail_phase > req.body.detail_phase) {
            delete req.body.detail_phase;
        }
    }
    else if (req.baseUrl.split('/')[1] == 'admin') {
        throw new Error("미구현");
    }
    else {
        return;
    }
    let body = req.body;
    for ([key, value] of Object.entries(body)) {
        if (!value) body[key] = null;
    }

    console.log(body);

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
            console.error(err);
            res.status(500).end();
        })
}

exports.delete = async (req, res, next) => {
    const id = req.query.n;
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
    const id = req.query.n;
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
    if (req.baseUrl.split('/')[1] != 'admin') {
        condition.users_id = user.id;
        condition.delete_date = null;
    }
    const page = req.query.p || 1;
    const limit = req.query.limit || 4;
    const skip = (page - 1) * limit;

    const project = projectsService.allRead(Object.assign(condition, { phase: { [Op.between]: [1, 8] } }))
    const temp_project = projectsService.allRead(Object.assign(condition, { phase: 0 }))
    const completed_project = projectsService.allRead(Object.assign(condition, { phase: 9 }), limit, skip)

    Promise.all([project, temp_project, completed_project])
        .then(([project, temp_project, completed_project]) => {
            res.render('myProject/main', {
                page: page,
                project: project.rows,
                temp_project: temp_project.rows,
                completed_project: completed_project,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}

exports.detail = async (req, res, next) => {
    const user = res.locals.user;

    const id = req.query.n || req.params.id;
    if (!id) return;

    let condition = { id: id };
    if (req.baseUrl.split('/')[1] == 'users') {
        condition.users_id = user.id;
        let project = await projectsService.readOne(condition);
        if ([0].includes(project.phase) && project.detail_phase > req.body.detail_phase) {
            delete req.body.detail_phase;
        }
    }
    else if (req.baseUrl.split('/')[1] == 'admin') {
        throw new Error("미구현");
    }
    else {
        return;
    }
    projectsService
        .readOne(condition)
        .then((result) => {
            console.log("find :", result);
            res.render('newProject/draft', { project: result })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        })
}