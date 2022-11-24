const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects');
const projectsService = require('../services/projects');
const ingredientsService = require('../services/ingredients');
const codezip = require('../codezip')

/* GET newProject listing. */
// MOQ/예산확인
router
  .post('/moq', projectsController.add)
  .get('/moq', async (req, res, next) => {
    let project = {};
    const id = req.query.n;
    if (id) {
      const user = res.locals.user;
      const condition = {
        users_id: user.id,
        id: id
      }
      project = await projectsService.readOne(condition);
    }
    res.render('newProject/moq', { project: project })
  })

// 타겟제품 유무 확인
router
  .post('/isTarget', projectsController.edit)
  .get('/isTarget', async (req, res, next) => {
    let project = {};
    const id = req.query.n;
    if (id) {
      const user = res.locals.user;
      const condition = {
        users_id: user.id,
        id: id
      }
      project = await projectsService.readOne(condition);
    }
    res.render('newProject/isTarget', { project: project })
  })

// 샘플의뢰서 기본
router
  .post('/basic', projectsController.edit)
  .get('/basic', async (req, res, next) => {
    let project = {};
    const id = req.query.n;
    if (id) {
      const user = res.locals.user;
      const condition = {
        users_id: user.id,
        id: id
      }
      project = await projectsService.readOne(condition);
    } res.render('newProject/basic', { project: project })
  })

// 샘플의뢰서 옵션
router
  .post('/option', projectsController.edit)
  .get('/option', async (req, res, next) => {
    let project = {};
    const id = req.query.n;
    if (id) {
      const user = res.locals.user;
      const condition = {
        users_id: user.id,
        id: id
      }
      project = projectsService.readOne(condition);
    }
    // let ingredients = ingredientsService.allRead({}, 10)
    Promise.all([project]).then(([project]) => {
      res.render('newProject/option', { project: project })
    })
  })

// 샘플의뢰서 초안
router
  //   .post('/draft', projectsController.edit)
  .get('/draft', async (req, res, next) => {
    let project = {};
    const id = req.query.n;
    if (id) {
      const user = res.locals.user;
      const condition = {
        users_id: user.id,
        id: id
      }
      project = await projectsService.readOne(condition);
    } res.render('newProject/draft', { project: project })
  })

// 샘플 수령주소
router
  //   .post('/order', projectsController.edit)
  .get('/order', async (req, res, next) => {
    let project = {};
    const id = req.query.n;
    if (id) {
      const user = res.locals.user;
      const condition = {
        users_id: user.id,
        id: id
      }
      project = await projectsService.readOne(condition);
    } res.render('newProject/order', { project: project })
  })

router.get('/', (req, res, next) => res.redirect(codezip.url.users.newProject._0))
module.exports = router;
