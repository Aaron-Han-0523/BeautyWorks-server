const models = require('../models');
const like_formulas = models.like_formulas;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.create = async (obj) => {
    return await like_formulas
        .create(Object.assign(obj, {
        }))
        .then(result => {
            console.log("like_formulas create success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.delete = async (condition) => {
    return await like_formulas
        .destroy({
            raw: true,
            where: condition
        })
        .then(result => {
            console.log("like_formulas delete success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.checkLike = async (condition) => {
    return await like_formulas
        .findOne({
            raw: true,
            where: condition
        })
        .then(result => {
            console.log("like_formulas find success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.countLike = async (id) => {
    return await like_formulas
        .findAll({
            raw: true,
            where: {
                formulas_id: id,
            },
            attributes: [
                [Sequelize.fn('count', Sequelize.col('formulas_id')), 'count']
            ]
        })
        .then(result => {
            console.log("like_formulas count success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.getLikelist = async (id) => {
    return await like_formulas
        .findOne({
            raw: true,
            where: {
                users_id: id,
            },
            attributes: [
                [Sequelize.fn('json_arrayagg', Sequelize.col('formulas_id')), 'list']
            ]
        })
        .then(result => {
            console.log("Get like_formulas list success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}