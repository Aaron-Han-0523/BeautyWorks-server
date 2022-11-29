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

exports.delete = async (obj) => {
  return await like_replies
    .destroy({
      where: {
        communities_id: obj.communities_id,
        replies_id: obj.replies_id,
        users_id: obj.users_id
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

exports.checkLike = async (obj) => {
  return await like_replies
    .findOne({
      where: {
        communities_id: obj.communities_id,
        replies_id: obj.replies_id,
        users_id: obj.users_id
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

exports.countLike = async (id) => {
  return await like_replies
    .findAll({
      where: {
        communities_id: id,
        replies_id: obj.replies_id,
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

exports.getLikelist = async (id) => {
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
  let query = `SELECT users.first_name, users.last_name, replies.*, like_replies.* FROM like_replies
              join replies
                on replies.communities_id=like_replies.communities_id and replies.id=like_replies.replies_id
              join users
                on replies.users_id=users.id
              where replies.delete_date is null and like_replies.users_id=${id};`
  return await models.sequelize.query(query, {
      // raw: true,
      type: QueryTypes.SELECT
    }).then(result => {
      console.log(result);
      return result
    })
}