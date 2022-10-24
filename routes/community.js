const express = require('express');
const router = express.Router();

const communityController = require('../controllers/community');
const newsController = require('../controllers/news');
const communityService = require('../services/community');

/* GET community listing. */
// 추가
router
  .post('/add', communityController.add)
  .get('/add', (req, res, next) => res.render('community/add'))

// 편집
router
  .put('/edit/:id', communityController.edit)
  .post('/edit/:id', communityController.edit)
  .get('/edit/:id', async (req, res, next) => res.render('community/edit', {
    data: await communityService.readOne(req.params.id)
  }))

// 삭제
router
  .get('/delete/:id', communityController.delete)

// 상세 조회
router
  .get('/news/:id', newsController.detail)
  .get('/:id', communityController.detail)

// 목록 조회
router
  .get('/', communityController.index)

module.exports = router;
