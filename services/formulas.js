const { Service } = require('../utils/template');
const models = require('../models');

const service = new Service(models.formulas);

module.exports = service;