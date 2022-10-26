var DataTypes = require("sequelize").DataTypes;
var _community = require("./community");
var _community_reply = require("./community_reply");
var _like_community = require("./like_community");
var _like_reply = require("./like_reply");
var _news = require("./news");
var _users = require("./users");

function initModels(sequelize) {
  var community = _community(sequelize, DataTypes);
  var community_reply = _community_reply(sequelize, DataTypes);
  var like_community = _like_community(sequelize, DataTypes);
  var like_reply = _like_reply(sequelize, DataTypes);
  var news = _news(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    community,
    community_reply,
    like_community,
    like_reply,
    news,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
