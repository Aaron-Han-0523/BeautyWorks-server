var DataTypes = require("sequelize").DataTypes;
var _community = require("./community");
var _community_reply = require("./community_reply");
var _news = require("./news");
var _news_reply = require("./news_reply");
var _users = require("./users");

function initModels(sequelize) {
  var community = _community(sequelize, DataTypes);
  var community_reply = _community_reply(sequelize, DataTypes);
  var news = _news(sequelize, DataTypes);
  var news_reply = _news_reply(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    community,
    community_reply,
    news,
    news_reply,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
