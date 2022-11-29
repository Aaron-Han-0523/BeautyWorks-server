const models = require('../models');
const like_communities = require('../models').like_communities;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = async (obj) => {
  return await like_communities
    .create(Object.assign(obj, {
    }))
    .then(result => {
      console.log("like_communities create success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.delete = async (obj) => {
  return await like_communities
    .destroy({
      where: {
        communities_id: obj.communities_id,
        users_id: obj.users_id
      }
    })
    .then(result => {
      console.log("like_communities delete success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}

exports.countLike = async (id) => {
  return await like_communities
    .findAndCountAll({
      raw: true,
      where: {
        communities_id: id,
      },
    })
    .then(result => {
      console.log("like_communities count success");
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
  return await like_communities
    .findOne({
      raw: true,
      where: {
        users_id: id,
      },
      attributes: [
        [Sequelize.fn('json_arrayagg', Sequelize.col('communities_id')), 'list']
      ]
    })
    .then(result => {
      console.log("like_communities get list success");
      return result;
    })
    .catch((err) => {
      // console.error(err);
      throw (err);
    });
}