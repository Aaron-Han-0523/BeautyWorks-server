const models = require('../models');
const replies = models.replies;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.count = async (id) => {
    return await replies.count({
        where: { communities_id: id }
    })
}

exports.allRead = async (condition = {}, paging = {}) => {
    console.log(paging.skip, '~', paging.limit);
    let query = `
    select users.first_name, users.last_name, rp.*, count(like_rp.users_id) as like_count, JSON_ARRAYAGG(like_rp.users_id) as users
    from replies rp
    join users
        on users.id=(select rp.users_id where rp.communities_id=${condition.id})
    left join like_replies like_rp
		on rp.communities_id=like_rp.communities_id and rp.id=like_rp.replies_id
    group by replies_id
    order by rp.id desc
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

    const count = this.count(condition.id);

    return Promise.all([count, data]).then(result => {
        return result;
    }).catch(err => {
        console.error(err);
        throw err;
    })
}

exports.maxId = async (id) => {
    return replies.max('id', {
        where: { communities_id: id }
    })
}

exports.create = async (obj) => {
    const newId = await this.maxId(obj.communities_id)
        .then(result => {
            // console.log("max id :", result);
            if (result === null) {
                return 0;
            } else {
                return result + 1;
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        })

    obj.id = newId

    return await replies
        .create(Object.assign(obj, {
        }))
        .then(result => {
            console.log("community replies create success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.readOne = async (obj) => {
    console.log("find community replies", obj);
    return await replies.findOne({
        raw: true,
        where: {
            communities_id: obj.communities_id,
            id: obj.id
        }
    })
}

exports.update = async (obj) => {
    console.log("update obj :", obj)
    return await replies
        .update(Object.assign(obj, {
        }), {
            where: {
                communities_id: obj.communities_id,
                id: obj.id
            }
        })
        .then(result => {
            console.log("community replies update success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}

exports.delete = async (obj) => {
    return await replies.update({
        delete_date: new Date()
    }, {
        where: {
            communities_id: obj.communities_id,
            id: obj.id
        }
    })
}