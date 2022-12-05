const models = require('../models');
const news = require('../models').news;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Service } = require('../utils/template');

let service = new Service(news);


service.create = async (obj) => {
    return await news
        .create(Object.assign(obj, {
            createUser: obj.user,
            create_date: new Date(),
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

service.update = async (obj, condition) => {
    console.log("update obj :", obj)
    return await news
        .update(Object.assign(obj, {
            update_date: new Date()
        }), {
            where: condition
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

service.allRead = async (condition = {}, paging = { skip: 0, limit: 4 }) => {
    console.log('all news read');
    let word = condition.word || '';
    let query = `
    select users.first_name, users.last_name, users.profile_image_path, news.* from news
    join users
        on users.id=news.users_id`
    let where = `
        where (news.title like('%${word}%') or news.content like('%${word}%'))`;
    if (condition.delete_date === null) {
        where += ` and news.delete_date is null `;
    }
    if (condition.id instanceof Array) {
        where += ` and news.id in (` + condition.id.join(',') + ')';
    }
    if (condition.users_id) {
        where += ` and news.users_id =${condition.users_id} `;
    }
    let option = `
        order by news.id desc
        limit ${paging.skip}, ${paging.limit};
        `
    const data = models.sequelize.query(query + where + option)
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
            return {
                count: data[0].count,
                rows: data[1]
            }
        })
}

// service.readOne = async (id) => {
//     try {
//         console.log('find', id)
//         var result = await news
//             .findOne({
//                 raw: true,
//                 where: {
//                     id: id,
//                 }
//             })
//             .then(result => result)
//             .catch(err => { throw (err) })
//         return result;
//     } catch (e) {
//         console.log(e);
//         // throw (' while getUser');
//     }
// }

service.delete = async (obj) => {
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

service.getPrevID = async (id) => {
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

service.getNextID = async (id) => {
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


module.exports = service;