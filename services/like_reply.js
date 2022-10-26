const models = require('../models');
const like_reply = models.like_reply;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


exports.create = async (obj) => {
  return await like_reply
    .create(Object.assign(obj, {
    }))
    .then(result => {
      console.log("like_reply create success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.delete = async (obj) => {
  return await like_reply
    .destroy({
      where: {
        community_id: obj.community_id,
        reply_id: obj.reply_id,
        users_id: obj.users_id
      }
    })
    .then(result => {
      console.log("like_reply delete success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.checkLike = async (obj) => {
  return await like_reply
    .findOne({
      where: {
        community_id: obj.community_id,
        reply_id: obj.reply_id,
        users_id: obj.users_id
      }
    })
    .then(result => {
      console.log("like_reply find success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.countLike = async (id) => {
  return await like_reply
    .findAll({
      where: {
        community_id: id,
        reply_id: obj.reply_id,
      },
      attributes: [
        [sequelize.fn('count', sequelize.col('community_id')), 'count']
      ]
    })
    .then(result => {
      console.log("like_reply count success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.getLikelist = async (id) => {
  return await like_reply
    .findAll({
      where: {
        users_id: id,
      }
    })
    .then(result => {
      console.log("like_reply get list success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}