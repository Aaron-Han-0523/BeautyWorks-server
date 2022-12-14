var express = require('express');
var router = express.Router();

const codezip = require("../codezip");

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.session.user) return res.redirect(codezip.url.users.signIn);
  
  return res.redirect(codezip.url.users.dashboard);
});

module.exports = router;
