const users = require('../models').users;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getUser = async function (user_id) {
    try {
        console.log('user find', user_id)
        var result = await users
            .findOne({
                raw: true,
                where: {
                    email: user_id,
                }
            })
            .then(result => result)
            .catch(err => { throw (err) })
        return result;
    } catch (e) {
        console.log(e);
        // throw (' while getUser');
    }
}

exports.changePassword = async (obj) => {
    console.log("users update obj :", obj)

    return await users
        .update({
            password: obj.newPassword,
            updateUser: obj.user,
            updateDate: new Date()
        }, {
            where: { users_id: obj.id }
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

exports.create = async (obj) => {
    console.log("users create obj :", obj)
    return await users
        .create(Object.assign(obj, {
        }))
        .then(result => {
            console.log("users create success");
            return result;
        })
        .catch((err) => {
            // console.(err);
            throw (err);
        });
}

exports.update = async (obj) => {
    console.log("users update obj :", obj)
    return await users
        .update(Object.assign(obj, {
        }), {
            where: { users_id: obj.users_id || obj.id }
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

exports.allRead = async (condition = {}) => {
    // console.log('all users read');

    return await users
        .findAndCountAll({
            raw: true,
            where: Object.assign(condition, {
                deleteDate: null
            }),
            order: [
                ['users_id', 'DESC']
            ]
        })
        .then(result => {
            console.log("users 'count' and 'rows' read success");
            console.log("data count :", result.count)
            return result;
        })
        .catch(err => {
            // console.(err);
            throw (err);
        })
}

exports.readOne = async (id) => {
    try {
        console.log('find', id)
        var result = await users
            .findOne({
                raw: true,
                where: {
                    id: id,
                }
            })
            .then(result => result)
            .catch(err => { throw (err) })
        return result;
    } catch (e) {
        console.log(e);
        // throw (' while getUser');
    }
}

exports.delete = async (obj) => {
    return await users
        .update({
            deleteUser: obj.user,
            deleteDate: new Date()
        }, {
            where: { users_id: obj.id }
        })
        .then(result => {
            console.log("users delete success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}

exports.checkID = async function (userid) {
    try {
        console.log('check', userid)
        var result = await users
            .findOne({
                raw: true,
                where: {
                    userid: userid,
                }
            })
            .then(result => result)
            .catch(err => { throw (err) })
        return result;
    } catch (e) {
        console.log(e);
        // throw (' while getUser');
    }
}
