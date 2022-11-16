const { Service } = require('../utils/template');
const models = require('../models');

const service = new Service(models.ingredients);

module.exports = service;