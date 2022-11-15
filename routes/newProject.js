const express = require('express');
const router = express.Router();

// const newProjectController = require('../controllers/newProject');
// const newProjectService = require('../services/newProject');
const codezip = require('../codezip')

/* GET newProject listing. */
// MOQ/예산확인
router
  //   .post('/moq', newProjectController.add)
  .get('/moq', (req, res, next) => res.render('newProject/moq'))

// 타겟제품 유무 확인
router
  //   .post('/isTarget', newProjectController.edit)
  .get('/isTarget', (req, res, next) => res.render('newProject/isTarget'))

// 샘플의뢰서 기본
router
  //   .post('/isTarget', newProjectController.edit)
  .get('/basic', (req, res, next) => res.render('newProject/basic'))

// 샘플의뢰서 옵션
router
  //   .post('/isTarget', newProjectController.edit)
  .get('/option', (req, res, next) => res.render('newProject/option'))

// 샘플의뢰서 초안
router
  //   .post('/isTarget', newProjectController.edit)
  .get('/draft', (req, res, next) => res.render('newProject/draft'))

// 샘플 수령주소
router
  //   .post('/isTarget', newProjectController.edit)
  .get('/order', (req, res, next) => res.render('newProject/order'))

router.get('/', (req, res, next) => res.redirect(codezip.url.users.newProject._0))
module.exports = router;
