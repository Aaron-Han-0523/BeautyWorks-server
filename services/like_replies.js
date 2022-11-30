const models = require('../models');
const like_replies = models.like_replies;
const { Op, QueryTypes } = require('sequelize');


exports.create = async (obj) => {
  return await like_replies
    .create(Object.assign(obj, {
    }))
    .then(result => {
      console.log("like_replies create success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.delete = async ({ communities_id, replies_id, users_id }) => {
  return await like_replies
    .destroy({
      where: {
        communities_id: communities_id,
        replies_id: replies_id,
        users_id: users_id
      }
    })
    .then(result => {
      console.log("like_replies delete success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.checkLike = async ({ communities_id, replies_id, users_id }) => {
  return await like_replies
    .findOne({
      where: {
        communities_id: communities_id,
        replies_id: replies_id,
        users_id: users_id
      }
    })
    .then(result => {
      console.log("like_replies find success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.countLike = async ({ id, replies_id }) => {
  return await like_replies
    .findAll({
      where: {
        communities_id: id,
        replies_id: replies_id,
      },
      attributes: [
        [sequelize.fn('count', sequelize.col('communities_id')), 'count']
      ]
    })
    .then(result => {
      console.log("like_replies count success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.getLikelist = async (condition = {}, paging = { skip: 0, limit: 4 }) => {
  // return await like_replies
  //   .findAll({
  //     raw: true,
  //     where: {
  //       users_id: id,
  //     }
  //   })
  //   .then(result => {
  //     console.log("like_replies get list success");
  //     return result;
  //   })
  //   .catch((err) => {
  //     // console.error(err);
  //     throw (err);
  //   });
  let query = `SELECT users.first_name, users.last_name, users.profile_image_path, replies.*, like_replies.* FROM like_replies
              join replies
                on replies.communities_id=like_replies.communities_id and replies.id=like_replies.replies_id
              join users
                on replies.users_id=users.id`
  let where = `
  where like_replies.users_id=${condition.users_id}`
  if (condition.delete_date === null) {
    where += ` and replies.delete_date is null `;
  }
  if (condition.id instanceof Array) {
    where += ` and replies.id in (` + condition.id.join(',') + ')';
  }
  let option = `
              order by replies.create_date desc
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

  query = `select count(*) as count from like_replies
  join replies
    on replies.communities_id=like_replies.communities_id and replies.id=like_replies.replies_id
  join users
    on replies.users_id=users.id`;
  const count = models.sequelize.query(query + where, {
    type: QueryTypes.SELECT
  }).then(function (results, metadata) {
    // 쿼리 실행 성공
    console.log("results")
    console.log(results)

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
}