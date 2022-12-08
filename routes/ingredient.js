const express = require('express');
const router = express.Router();

const ingredientsController = require('../controllers/ingredients');
const ingredientsService = require('../services/ingredients');

/* GET ingredients listing. */
router
  .use((req, res, next) => {
    if (req.body.effects instanceof Array) {
      req.body.effects = req.body.effects.join(',')
    }

    next();
  })

// 추가
router
  .post('/add', ingredientsController.add)
  .get('/add', (req, res, next) => res.render('admin/ingredient/detail', { ingredient: {} }))

// 편집
router
  .put('/:id', ingredientsController.edit)
  .post('/:id', ingredientsController.edit)

// 삭제
router
  .get('/delete/:id', ingredientsController.delete)

// 복구
router
  .get('/recovery/:id', ingredientsController.recovery)

// 상세 조회
router
  .get('/:id', ingredientsController.detail)

// 좋아요
// router
//   .post('/like', ingredientsController.like)

// 목록 조회
router
  .get('/', ingredientsController.index)

module.exports = router;
