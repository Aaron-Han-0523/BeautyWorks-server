const models = require('../models');
const users = models.users;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Service } = require('../utils/template');

const service = new Service(users);


service.getUser = async function (condition) {
    try {
        console.log('user find', condition)
        var result = await users
            .findOne({
                raw: true,
                where: condition
            })
            .then(result => result)
            .catch(err => { throw (err) })
        return result;
    } catch (e) {
        console.log(e);
        // throw (' while getUser');
    }
}

service.changePassword = async (obj) => {
    console.log("users update obj :", obj)

    return await users
        .update({
            password: obj.newPassword,
            update_date: new Date()
        }, {
            where: { id: obj.id }
        })
        .then(result => {
            console.log("users update success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}


module.exports = service;