const models = require('../models');
const like_community = require('../models').like_community;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = async (obj) => {
  return await like_community
    .create(Object.assign(obj, {
    }))
    .then(result => {
      console.log("like_community create success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.delete = async (obj) => {
  return await like_community
    .destroy({
      where: {
        community_id: obj.community_id,
        users_id: obj.users_id
      }
    })
    .then(result => {
      console.log("like_community delete success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.countLike = async (id) => {
  return await like_community
    .findAndCountAll({
      raw: true,
      where: {
        community_id: id,
      },
    })
    .then(result => {
      console.log("like_community count success");
      let newRows = []
      result.rows.forEach(element => {
        newRows.push(element.users_id);
      });
      result.rows = newRows;
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.getLikelist = async (id) => {
  return await like_community
    .findAll({
      where: {
        users_id: id,
      }
    })
    .then(result => {
      console.log("like_community get list success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}