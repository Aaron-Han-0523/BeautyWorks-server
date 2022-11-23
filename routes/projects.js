const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects');
const projectsService = require('../services/projects');

/* GET projects listing. */
// 추가
// router
//   .post('/add', projectsController.add)
//   .get('/add', (req, res, next) => res.render('projects/add'))

// 편집
router
    .put('/edit/:id', projectsController.edit)
    .post('/edit/:id', projectsController.edit)
    .get('/edit/:id', async (req, res, next) => {
        const data = await projectsService.readOne(req.params.id);
        if (res.locals.user.id != data.users_id) return res.status(403).end();
        return res.render('projects/edit', {
            data: data
        });
    })

// 삭제
// router
//   .get('/delete/:id', projectsController.delete)

// 상세 조회
router
    .get('/:id', projectsController.detail)

// 목록 조회
router
    .get('/', projectsController.index)

module.exports = router;
