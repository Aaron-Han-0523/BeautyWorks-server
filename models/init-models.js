var DataTypes = require("sequelize").DataTypes;
var _communities = require("./communities");
var _documents = require("./documents");
var _formulas = require("./formulas");
var _ingredients = require("./ingredients");
var _like_communities = require("./like_communities");
var _like_formulas = require("./like_formulas");
var _like_replies = require("./like_replies");
var _news = require("./news");
var _packages = require("./packages");
var _projects = require("./projects");
var _replies = require("./replies");
var _user_log = require("./user_log");
var _users = require("./users");

function initModels(sequelize) {
  var communities = _communities(sequelize, DataTypes);
  var documents = _documents(sequelize, DataTypes);
  var formulas = _formulas(sequelize, DataTypes);
  var ingredients = _ingredients(sequelize, DataTypes);
  var like_communities = _like_communities(sequelize, DataTypes);
  var like_formulas = _like_formulas(sequelize, DataTypes);
  var like_replies = _like_replies(sequelize, DataTypes);
  var news = _news(sequelize, DataTypes);
  var packages = _packages(sequelize, DataTypes);
  var projects = _projects(sequelize, DataTypes);
  var replies = _replies(sequelize, DataTypes);
  var user_log = _user_log(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  replies.belongsTo(communities, { as: "community", foreignKey: "communities_id"});
  communities.hasMany(replies, { as: "replies", foreignKey: "communities_id"});
  projects.belongsTo(formulas, { as: "formula", foreignKey: "formulas_id"});
  formulas.hasMany(projects, { as: "projects", foreignKey: "formulas_id"});
  projects.belongsTo(packages, { as: "package", foreignKey: "packages_id"});
  packages.hasMany(projects, { as: "projects", foreignKey: "packages_id"});
  communities.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(communities, { as: "communities", foreignKey: "users_id"});
  news.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(news, { as: "newss", foreignKey: "users_id"});
  projects.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(projects, { as: "projects", foreignKey: "users_id"});
  replies.belongsTo(users, { as: "user", foreignKey: "users_id"});
  users.hasMany(replies, { as: "replies", foreignKey: "users_id"});
  user_log.belongsTo(users, { as: "email_user", foreignKey: "email"});
  users.hasMany(user_log, { as: "user_logs", foreignKey: "email"});

  return {
    communities,
    documents,
    formulas,
    ingredients,
    like_communities,
    like_formulas,
    like_replies,
    news,
    packages,
    projects,
    replies,
    user_log,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
