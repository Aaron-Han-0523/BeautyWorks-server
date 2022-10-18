const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const usersService = require('../services/users');

/* GET users listing. */
// 사용자 등록
router
  .post('/signUp', usersController.add)
  .get('/signUp', (req, res, next) => res.render('users/add'));

// 사용자 접속
router
  .post('/signIn', usersController.login)
  .get('/signIn', (req, res, next) => res.render('users/signIn'))

// 사용자 접속
router
  .get('/signOut', usersController.logout);

// 사용자 편집
router
  .put('/edit/:id', usersController.edit)
  .post('/edit/:id', usersController.edit)
  .get('/edit/:id', (req, res, next) => res.render('users/edit'));

// 사용자 삭제
router
  .get('/delete/:id', usersController.delete)
  .delete('/:id', usersController.delete);

// 사용자 조회
router.get('/:id', usersController.detail);
router.get('/', usersController.index);

module.exports = router;
