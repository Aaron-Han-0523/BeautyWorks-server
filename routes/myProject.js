const express = require('express');
const router = express.Router();

// const myProjectController = require('../controllers/myProject');
// const myProjectService = require('../services/myProject');

/* GET myProject listing. */

// 샘플의뢰서
router
    //   .post('/isTarget', myProjectController.edit)
    .get('/sampleReq', (req, res, next) => res.render('myProject/sampleReq'))

// 샘플 확정
router
    // .post('/chooseSample', myProjectController.edit)

// 메인
router.get('/', (req, res, next) => res.render('myProject/main'))
module.exports = router;
