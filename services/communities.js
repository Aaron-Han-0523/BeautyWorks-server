const models = require('../models');
const communities = require('../models').communities;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = async (obj) => {
    return await communities
        .create(Object.assign(obj, {
            createDate: new Date(),
            updateDate: new Date(),
        }))
        .then(result => {
            console.log("communities create success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.update = async (obj) => {
    console.log("update obj :", obj)
    return await communities
        .update(Object.assign(obj, {
            updateDate: new Date()
        }), {
            where: { id: obj.id }
        })
        .then(result => {
            console.log("communities update success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}

exports.allRead = async (condition = {}, paging = {}) => {
    console.log(paging.skip, '~', paging.limit);
    let word = condition.word || '';
    let query = `
    select users.first_name, users.last_name, communities.* from communities
    join users
        on users.id=(select communities.users_id
        where (communities.title like('%${word}%') or communities.content like('%${word}%')))
    order by communities.id desc
    limit ${paging.skip}, ${paging.limit};
    `
    const data = models.sequelize.query(query)
        .then(function (results, metadata) {
            // 쿼리 실행 성공
            return results[0];
        })
        .catch(function (err) {
            // 쿼리 실행 에러 
            console.error(err);
            throw err;
        });

    query = `
    select count(*) as count from communities
    join users
        on communities.users_id=users.id
    where (communities.title like('%${word}%') or communities.content like('%${word}%'))
    `
    const count = models.sequelize.query(query)
        .then(function (results, metadata) {
            // 쿼리 실행 성공
            return results[0][0];
        })
        .catch(function (err) {
            // 쿼리 실행 에러 
            console.error(err);
            throw err;
        });


    return Promise.all([count, data])
        .then((data) => {
            return data
        })
    // return await communities
    //     .findAndCountAll({
    //         raw: true,
    //         where: Object.assign(condition, {
    //         }),
    //         order: [
    //             ['id', 'DESC'],
    //         ],
    //         offset: paging.skip,
    //         limit: paging.limit
    //     })
    //     .then(result => {
    //         console.log("communities 'count' and 'rows' read success");
    //         console.log("data count :", result.count)
    //         return result;
    //     })
    //     .catch(err => {
    //         // console.error(err);
    //         throw (err);
    //     })
}

exports.readOne = async (id) => {
    try {
        console.log('find', id)
        var result = await communities
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

exports.delete = async (id) => {
    return await communities
        .update({
            delete_date: new Date()
        }, {
            where: { id: id }
        })
        .then(result => {
            console.log("communities delete success result :", result);
            return result;
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}

exports.getPrevID = async (id) => {
    let query = `SELECT id FROM communities WHERE id < ${id} ORDER BY id DESC LIMIT 1;`
    return await models.sequelize.query(query)
        .then(function (results, metadata) {
            // 쿼리 실행 성공
            return results[0];
        })
        .catch(function (err) {
            // 쿼리 실행 에러 
            console.error(err);
            throw err;
        });
}

exports.getNextID = async (id) => {
    let query = `SELECT id FROM communities WHERE id > ${id} ORDER BY id LIMIT 1;`
    return await models.sequelize.query(query)
        .then(function (results, metadata) {
            // 쿼리 실행 성공
            return results[0];
        })
        .catch(function (err) {
            // 쿼리 실행 에러 
            console.error(err);
            throw err;
        });
}