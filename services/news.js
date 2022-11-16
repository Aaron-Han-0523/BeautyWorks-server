const models = require('../models');
const news = require('../models').news;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = async (obj) => {
    return await news
        .create(Object.assign(obj, {
            createUser: obj.user,
            createDate: new Date(),
        }))
        .then(result => {
            console.log("news create success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw new Error(err);
        });
}

exports.update = async (obj) => {
    console.log("update obj :", obj)
    return await news
        .update(Object.assign(obj, {
            updateUser: obj.user,
            updateDate: new Date()
        }), {
            where: { id: obj.id }
        })
        .then(result => {
            console.log("news update success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw new Error(err);
        })
}

exports.allRead = async (condition = {}, paging = { skip: 0, limit: 4 }) => {
    // console.log('all news read');
    let word = condition.word || '';
    let query = `
    select users.first_name, users.last_name, news.* from news
    join users
        on users.id=(
            select news.users_id
            where (
                news.title like('%${word}%') or news.content like('%${word}%')
                )
            )
    order by news.id desc
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
    select count(*) as count from news
    join users
        on users.id=news.users_id
    where (news.title like('%${word}%') or news.content like('%${word}%'))
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
        .then(data => {
            // console.log(data)
            return data
        })

    // return await news
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
    //         console.log("news 'count' and 'rows' read success");
    //         console.log("data count :", result.count)
    //         return result;
    //     })
    //     .catch(err => {
    //         // console.error(err);
    //         throw new Error(err);
    //     })
}

exports.readOne = async (id) => {
    try {
        console.log('find', id)
        var result = await news
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
    return await news
        .update({
            deleteUser: obj.user,
            deleteDate: new Date()
        }, {
            where: { id: obj.id }
        })
        .then(result => {
            console.log("news delete success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw new Error(err);
        })
}

exports.getPrevID = async (id) => {
    let query = `SELECT id FROM news WHERE id < ${id} ORDER BY id DESC LIMIT 1;`
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
    let query = `SELECT id FROM news WHERE id > ${id} ORDER BY id LIMIT 1;`
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