const express = require('express');
const router = express.Router();

const packagesController = require('../controllers/packages');

const myUtils = require('../utils/myUtils');

router
    .use(myUtils.upload("packages").array("images", 1), (req, res, next) => {
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

        console.log("packaging request body :", req.body)
        next();
    })

// 추가
router
    .post('/add', packagesController.add)
    .get('/add', (req, res, next) => res.render('admin/packaging/detail', { package: {} }))

// 편집
router
    .put('/:id', packagesController.edit)
    .post('/:id', packagesController.edit)

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