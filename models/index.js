'use strict';

const initModels = require('./init-models');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const loggingOptions = {
  benchmark: true,
  logging: (logStr, execTime, options) => {
    if (!options) {
      options = execTime;
      execTime = undefined;
    }

    if (execTime) {
      console.log((`[${execTime} ms]`), (logStr));
    }
  }
}

let sequelize = new Sequelize(config.database, config.username, config.password, Object.assign(config, loggingOptions));

const db = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;