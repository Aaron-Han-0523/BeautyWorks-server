const country = require('./country');
const url = require('./url.json')
const numberOfProduct = require('./numberOfProduct.json')
const numberOfProjectState = require('./numberOfProjectState.json')
const effects = require('./effects.json')

const codezip = {};

codezip.country = country;
codezip.url = url;
codezip.numberOfProduct = numberOfProduct;
codezip.numberOfProjectState = numberOfProjectState;
codezip.effects = effects;
codezip.viscosity = ["0%", "20%", "40%", "60%", "80%", "100%"]
codezip.ingredient_category = ["IC00", "IC01", "IC02", "IC03"]
codezip.moq_select_list = ["3,000", "5,000", "10,000"]
codezip.capacity_unit = ["g", "ml", "oz", "fl.oz"]

module.exports = codezip;