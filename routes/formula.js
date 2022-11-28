const express = require('express');
const router = express.Router();

const formulasController = require('../controllers/formulas');
const formulasService = require('../services/formulas');

/* GET formulas listing. */
// 추가
router
  .post('/add', formulasController.add)
  .get('/add', (req, res, next) => res.render('formulas/add'))

// 편집
router
  .put('/edit/:id', formulasController.edit)
  .post('/edit/:id', formulasController.edit)
  .get('/edit/:id', async (req, res, next) => {
    const formula = await formulasService.readOne(req.params.id);
    if (req.baseUrl.split('/')[1] != 'admin') return res.status(403).end();
    return res.render('formulas/edit', {
      formula: formula
    });
  })

// 삭제
router
  .get('/delete/:id', formulasController.delete)

// 상세 조회
router
  .get('/:id', formulasController.detail)

// 좋아요
router
  .get('/like/:id', formulasController.like)

// 목록 조회
router
  .get('/', formulasController.index)

module.exports = router;
