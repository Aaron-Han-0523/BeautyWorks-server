const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects');
const projectsService = require('../services/projects');

/* GET myProject listing. */

// 샘플 피드백
router
    .post('/feedback', projectsController.edit)
    .get('/feedback', (req, res, next) => {
        projectsService.readOne({
            id: req.query.n,
            users_id: res.locals.user.id
        }).then(result => {
            res.render('myProject/feedback', { project: result });
        }).catch(err => {
            res.status(500);
        })
    })

// 샘플 확정
router
    .post('/formulaConfirmed', projectsController.edit)

// 메인
router.get('/', projectsController.index)

module.exports = router;
