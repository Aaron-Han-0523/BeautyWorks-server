const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const usersService = require('../services/users');

/* GET users listing. */
// 사용자 등록
router
  .post('/signUp', usersController.add)
  .get('/signUp', (req, res, next) => res.render('users/signUp'));

// Email 확인
router
  .post('/validationEmail', usersController.validationEmail)

// 사용자 접속
router
  .post('/signIn', usersController.login)
  .get('/signIn', (req, res, next) => res.render('users/signIn'))


////////////////////////////////////
//    사용자 로그인 필요한 곳      //
////////////////////////////////////
router
  .use((req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/users/signIn');
    }
    return next();
  })


router.get('/layout', (req, res) => res.render('layout/layout', { user: req.session.user }));

// 사용자 대시보드
router.use('/dashboard', (req, res) => res.render('dashboard/dashboard', { user: req.session.user }));

// 사용자 접속해제
router
  .get('/signOut', usersController.logout);

// 사용자 마이페이지
router.get('/myPage', (req, res) => res.render('users/myPage', { user: req.session.user }));
router.get('/myAccount', (req, res) => res.render('users/myAccount', { user: req.session.user }));

module.exports = router;
