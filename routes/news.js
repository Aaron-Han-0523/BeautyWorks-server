const express = require('express');
const router = express.Router();

const newsController = require('../controllers/news');
const newsService = require('../services/news');

/* GET news listing. */
// 추가
router
  .post('/add', newsController.add)
  .get('/add', (req, res, next) => res.render('admin/news/detail', { news: {} }))

// 편집
router
  .put('/:id', newsController.edit)
  .post('/:id', newsController.edit)

// 삭제
router
  .get('/delete/:id', newsController.delete)

// 복구
router
  .get('/recovery/:id', newsController.recovery)

// 상세 조회
router
  .get('/:id', newsController.detail)

// 목록 조회
router
  .get('/', newsController.index)

module.exports = router;