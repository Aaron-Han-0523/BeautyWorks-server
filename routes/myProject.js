const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects');
const projectsService = require('../services/projects');

/* GET myProject listing. */

// 샘플의뢰서
router
    //   .post('/isTarget', myProjectController.edit)
    .get('/sampleReq', (req, res, next) => res.render('myProject/sampleReq'))

// 샘플 확정
router
    .post('/formulaConfirmed', projectsController.edit)

// 메인
router.get('/', projectsController.index)

module.exports = router;
