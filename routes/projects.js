const express = require('express');
const router = express.Router();

const myUtils = require('../utils/myUtils');

const projectsController = require('../controllers/projects');
const projectsService = require('../services/projects');

/* GET projects listing. */
// 추가
// router
//   .post('/add', projectsController.add)
//   .get('/add', (req, res, next) => res.render('projects/add'))

// 편집
router
    .post('/edit/:id',
        myUtils.upload('projects').fields([{ name: 'file_paths' }, { name: 'image_paths' }]),
        myUtils.multerConsoleError,
        projectsController.edit
    )
    .put('/edit/:id',
        myUtils.upload('projects').fields([{ name: 'file_paths' }, { name: 'image_paths' }]),
        myUtils.multerConsoleError,
        projectsController.edit
    )

// 삭제
router
    .get('/delete/:id', projectsController.delete)

// 복구
router
    .get('/recovery/:id', projectsController.recovery)

// 상세 조회
router
    .get('/:id', projectsController.detail)

//// 목록 조회
// 임시 저장 프로젝트
router
    .get('/temp_projects/:id', projectsController.temp_projects)
// 진행 중인 프로젝트
router
    .get('/progress_projects/:id', projectsController.progress_projects)
// 완료된 프로젝트
router
    .get('/completed_projects/:id', projectsController.completed_projects)

module.exports = router;
