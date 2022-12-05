const express = require('express');
const router = express.Router();

const ingredientsController = require('../controllers/ingredients');
const ingredientsService = require('../services/ingredients');

/* GET ingredients listing. */
// 추가
router
  .post('/add', ingredientsController.add)
  .get('/add', (req, res, next) => res.render('ingredients/add'))

// 편집
router
  .put('/edit/:id', ingredientsController.edit)
  .post('/edit/:id', ingredientsController.edit)
  .get('/edit/:id', async (req, res, next) => {
    const ingredient = await ingredientsService.readOne(req.params.id);
    if (req.baseUrl.split('/')[1] != 'admin') return res.status(403).end();
    return res.render('ingredients/edit', {
      ingredient: ingredient
    });
  })

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
