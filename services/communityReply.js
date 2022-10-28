const models = require('../models');
const reply = models.community_reply;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.count = async (id) => {
    return await reply.count({
        where: { community_id: id }
    })
}

exports.allRead = async (condition = {}, paging = {}) => {
    console.log(paging.skip, '~', paging.limit);
    let query = `
    select users.firstName, users.lastName, rp.*, count(like_rp.users_id) as likeCount, JSON_ARRAYAGG(like_rp.users_id) as users
    from community_reply rp
    join users
        on users.users_id=(select rp.users_id where rp.community_id=${condition.id})
    left join like_reply like_rp
		on rp.community_id=like_rp.community_id and rp.reply_id=like_rp.reply_id
    group by reply_id
    order by rp.reply_id desc
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
    return reply.max('reply_id', {
        where: { community_id: id }
    })
}

exports.create = async (obj) => {
    const newId = await this.maxId(obj.community_id)
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

    obj.reply_id = newId

    return await reply
        .create(Object.assign(obj, {
        }))
        .then(result => {
            console.log("community reply create success");
            return result;
        })
        .catch((err) => {
            // console.error(err);
            throw (err);
        });
}

exports.readOne = async (obj) => {
    console.log("find community reply", obj);
    return await reply.findOne({
        raw: true,
        where: {
            community_id: obj.community_id,
            reply_id: obj.reply_id
        }
    })
}

exports.update = async (obj) => {
    console.log("update obj :", obj)
    return await reply
        .update(Object.assign(obj, {
        }), {
            where: {
                community_id: obj.community_id,
                reply_id: obj.reply_id
            }
        })
        .then(result => {
            console.log("community reply update success");
            return result.pop();
        })
        .catch(err => {
            // console.log(err);
            throw (err);
        })
}

exports.delete = async (obj) => {
    return await reply.destroy({
        where: {
            community_id: obj.community_id,
            reply_id: obj.reply_id
        }
    })
}