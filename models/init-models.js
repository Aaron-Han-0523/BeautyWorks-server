var DataTypes = require("sequelize").DataTypes;
var _community = require("./community");
var _community_reply = require("./community_reply");
var _notice = require("./notice");
var _notice_reply = require("./notice_reply");
var _users = require("./users");

function initModels(sequelize) {
  var community = _community(sequelize, DataTypes);
  var community_reply = _community_reply(sequelize, DataTypes);
  var notice = _notice(sequelize, DataTypes);
  var notice_reply = _notice_reply(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    community,
    community_reply,
    notice,
    notice_reply,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
