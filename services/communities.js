const models = require('../models');
const communities = require('../models').communities;
const { Op, QueryTypes } = require('sequelize');

const { Service } = require('../utils/template');

const service = new Service(communities);


service.create = async (obj) => {
    return await communities
        .create(Object.assign(obj, {
            create_date: new Date(),
            update_date: new Date(),
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

service.update = async (obj) => {
    console.log("update obj :", obj)
    return await communities
        .update(Object.assign(obj, {
            update_date: new Date()
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

service.allRead = async (condition = {}, paging = { skip: 0, limit: 4 }) => {
    console.log(paging.skip, '~', paging.limit);
    let word = condition.word || '';
    let query = `
    select users.first_name, users.last_name, users.profile_image_path, communities.* from communities
    join users
        on users.id=communities.users_id`
    let where = `
    where (communities.title like('%${word}%') or communities.content like('%${word}%'))`;
    if (condition.delete_date === null) {
        where += ` and communities.delete_date is null `;
    }
    if (condition.id instanceof Array) {
        where += ` and communities.id in (` + condition.id.join(',') + ')';
    }
    if (condition.users_id) {
        where += ` and communities.users_id =${condition.users_id} `;
    }
    let option = `
    order by communities.id desc
    limit ${paging.skip}, ${paging.limit};
    `
    const data = models.sequelize.query(query + where + option, {
        type: QueryTypes.SELECT
    }).then(function (results, metadata) {
        // 쿼리 실행 성공
        // console.log("results")
        // console.log(results)

        return results;
    }).catch(function (err) {
        // 쿼리 실행 에러 
        console.error(err);
        throw err;
    });

    query = `select count(*) as count from communities`;
    const count = models.sequelize.query(query + where, {
        type: QueryTypes.SELECT
    }).then(function (results, metadata) {
        // 쿼리 실행 성공
        console.log("results")
        // console.log(results)

        return results[0];
    }).catch(function (err) {
        // 쿼리 실행 에러 
        console.error(err);
        throw err;
    });


    return Promise.all([count, data])
        .then(([count, data]) => {
            return {
                count: count.count,
                rows: data
            }
        })
    //     return await communities
    //         .findAndCountAll({
    //             raw: true,
    //             where: condition,
    //             include: {
    //                 model: models.users,
    //                 as: "user",
    //                 attributes: [
    //                     "first_name",
    //                     "last_name"
    //                 ]
    //             },
    //             order: [
    //                 ['id', 'DESC'],
    //             ],
    //             offset: paging.skip,
    //             limit: paging.limit
    //         })
    //         .then(result => {
    //             console.log("communities 'count' and 'rows' read success");
    //             console.log("data count :", result.count)
    //             return result;
    //         })
    //         .catch(err => {
    //             console.error(err);
    //             throw (err);
    //         })
}

service.readOne = async (id) => {
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

service.delete = async (id) => {
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

service.getPrevID = async (id) => {
    let query = `SELECT id FROM communities WHERE id < ${id} and delete_date is null ORDER BY id DESC LIMIT 1;`
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

service.getNextID = async (id) => {
    let query = `SELECT id FROM communities WHERE id > ${id} and delete_date is null  ORDER BY id LIMIT 1;`
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

module.exports = service;