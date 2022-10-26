const models = require('../models');
const community = require('../models').community;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = async (obj) => {
    return await community
        .create(Object.assign(obj, {
            createDate: new Date(),
            updateDate: new Date(),
        }))
        .then(result => {
            console.log("community create success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.update = async (obj) => {
    console.log("update obj :", obj)
    return await community
        .update(Object.assign(obj, {
            updateDate: new Date()
        }), {
            where: { community_id: obj.id }
        })
        .then(result => {
            console.log("community update success");
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
    select users.firstName, users.lastName, community.* from community
    join users
        on users.users_id=(select community.users_id
        where (community.title like('%${word}%') or community.contents like('%${word}%')))
    order by community.community_id desc
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
    select count(*) as count from community
    join users
        on community.users_id=users.users_id
    where (community.title like('%${word}%') or community.contents like('%${word}%'))
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
    // return await community
    //     .findAndCountAll({
    //         raw: true,
    //         where: Object.assign(condition, {
    //         }),
    //         order: [
    //             ['community_id', 'DESC'],
    //         ],
    //         offset: paging.skip,
    //         limit: paging.limit
    //     })
    //     .then(result => {
    //         console.log("community 'count' and 'rows' read success");
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
        var result = await community
            .findOne({
                raw: true,
                where: {
                    community_id: id,
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
    return await community
        .destroy({
            where: { community_id: id }
        })
        .then(result => {
            console.log("community delete success result :", result);
            return result;
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}

exports.getPrevID = async (id) => {
    let query = `SELECT community_id FROM community WHERE community_id < ${id} ORDER BY community_id DESC LIMIT 1;`
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
    let query = `SELECT community_id FROM community WHERE community_id > ${id} ORDER BY community_id LIMIT 1;`
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