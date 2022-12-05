const express = require('express');
const router = express.Router();

const formulasController = require('../controllers/formulas');
const formulasService = require('../services/formulas');

const myUtils = require('../utils/myUtils');

/* GET formulas listing. */
router
  .use(myUtils.upload("formulas").array("image_paths"), (req, res, next) => {
    console.log("files", req.files);
    const files = req.files;

    if (files) {
      let paths = [];
      files.forEach((file, index) => {
        paths.push('/' + file.path)
      })
      req.body["image_paths"] = paths.join(',');
    }


    next();
  })

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

// 상세 조회
router
  .get('/:id', formulasController.detail)

// 삭제
router
  .get('/delete/:id', formulasController.delete)

// 복구
router
  .get('/recovery/:id', formulasController.recovery)

// 좋아요
router
  .get('/like/:id', formulasController.like)

// 목록 조회
router
  .get('/', formulasController.index)

module.exports = router;
