const express = require('express');
const router = express.Router();

const packagesController = require('../controllers/packages');

const myUtils = require('../utils/myUtils');

router
    .use(myUtils.upload("packages").array("image_paths"), (req, res, next) => {
        console.log(req.files);
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
    .post('/add', packagesController.add)
    .get('/add', (req, res, next) => res.render('packages/add'))

// 편집
router
    .put('/edit/:id', packagesController.edit)
    .post('/edit/:id', packagesController.edit)
    .get('/edit/:id', async (req, res, next) => {
        const formula = await packagesService.readOne(req.params.id);
        if (req.baseUrl.split('/')[1] != 'admin') return res.status(403).end();
        return res.render('packages/edit', {
            formula: formula
        });
    })

// 상세 조회
router
    .get('/:id', packagesController.detail)

// 삭제
router
    .get('/delete/:id', packagesController.delete)

// 복구
router
    .get('/recovery/:id', packagesController.recovery)

// 목록 조회
router
    .get('/', packagesController.index)

module.exports = router;