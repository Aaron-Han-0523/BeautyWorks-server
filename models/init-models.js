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
  var users = _users(sequelize, DataTypes);


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
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
