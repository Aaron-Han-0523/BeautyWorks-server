const { Service } = require('../utils/template');
const models = require('../models');

const service = new Service(models.documents);

module.exports = service;