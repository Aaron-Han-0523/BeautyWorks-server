const express = require('express');
const router = express.Router();

const formulasController = require('../controllers/formulas');

const myUtils = require('../utils/myUtils');

/* GET formulas listing. */
router
  .use(myUtils.upload("formulas").array("images", 5), (req, res, next) => {
    console.log("files", req.files);
    const files = req.files;

    if (files && files.length != 0) {
      let paths = [];
      files.forEach((file, index) => {
        paths.push('/' + file.path)
      })
      req.body["image_paths"] = paths.join(',');

      console.log(req.body);
    }

    next();
  })

router
  .use((req, res, next) => {
    for (let key in req.body) {
      if (!req.body[key]) {
        req.body[key] = null;
      }
    }

    console.log("formula request body :", req.body)
    next();
  })

// 추가
router
  .post('/add', formulasController.add)
  .get('/add', (req, res, next) => res.render('admin/formula/detail', { formula: {} }))

// 편집
router
  .put('/:id', formulasController.edit)
  .post('/:id', formulasController.edit)

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
