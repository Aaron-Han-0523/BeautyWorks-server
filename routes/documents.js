const express = require('express');
const router = express.Router();

const documentsService = require('../services/documents');
const documentsController = require('../controllers/documents')

// 상세 조회
router.get('/:id', documentsController.detail);

// 목록 조회
router.get('/', documentsController.index);


////////////////////////////////////
//    관리자 로그인 필요한 곳      //
////////////////////////////////////

// var createError = require('http-errors');

// router
//     .use(async (req, res, next) => {
//         const user = res.locals.user;
//         const base = req.baseUrl.split('/')[1];

//         if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
//             return next(createError(404));
//         }
//     })

// router.get('/edit/:id', (req, res, next) => res.render('documents/detail'))

module.exports = router;