const { Service } = require("../utils/template");
const models = require("../models");

const service = new Service(models.ingredients);

service.allRead = async (condition = {}, limit, skip) => {
  // console.log("????", Object.keys(this.model))
  return await service.model
    .findAndCountAll({
      where: condition,
      order: [["id"]],
      offset: skip,
      limit: limit,
    })
    .then((result) => {
      console.log("find data Total :", result.count);
      return {
        count: result.count,
        rows: result.rows,
      };
    })
    .catch((err) => {
      throw err;
    });
};
module.exports = service;
