const express = require('express');
const router = express.Router();

const communityRouter = require('./community');
const newsRouter = require('./news');
const newProjectRouter = require('./newProject');
const myProjectRouter = require('./myProject');

const usersController = require('../controllers/users');
const usersService = require('../services/users');
const multer = require("multer");
const path = require("path");
const myUtils = require('../utils/myUtils');

// 날짜 형식 포맷터 YYYY-MM-DD_시간h분m초s
function formatDate(d_t) {
  let year = d_t.getFullYear(); let month = ("0"
    + (d_t.getMonth() + 1)).slice(-2); let day = ("0" +
      d_t.getDate()).slice(-2); let hour = ("0" + d_t.getHours()).slice(-2);
  let minute = ("0" + d_t.getMinutes()).slice(-2); let seconds = ("0" +
    d_t.getSeconds()).slice(-2); return year + "-" + month + "-" + day
      + "_" + hour + "h" + minute + "m" + seconds + "s"
}

// 업로드 파일 저장 설정
let storage = (fileName) => multer.diskStorage({
  destination: function (req, file, callback) {
    const FILES_PATH = path.join(process.env.UPLOADFILES_ROOT, "profileImage");
    const FOLDER_PATH = path.join(process.cwd(), FILES_PATH);
    myUtils.mkdir(FOLDER_PATH);

    callback(null, FILES_PATH)
  }, filename: function (req, file, callback) {
    let extension = path.extname(file.originalname);
    let basename = path.basename(file.originalname, extension);
    let encoding = ""
    for (let i = 0; i < basename.length; i++) {
      encoding += basename.codePointAt(i).toString(16);
    }
    encoding = encoding.slice(0, 200);
    callback(null, req.res.locals.user.users_id + '-' + Date.now() + "-" + encoding + extension);
  },
});

// 미들웨어 등록
const upload = (fileName) => multer({
  storage: storage(fileName),
  // file size 제한(MB)
  limits: {
    fileSize: process.env.FILE_MAX_SIZE * 1024 * 1024,
  },
});


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
  .get('/signIn', (req, res, next) => {
    res.render('users/signIn');
  })


////////////////////////////////////
//    사용자 로그인 필요한 곳      //
////////////////////////////////////
router
  .use(async (req, res, next) => {
    console.log("env :", process.env.NODE_ENV);

    if (!req.session.user) {
      if (process.env.NODE_ENV == "development") {
        req.session.user = await usersService.getUser("user-dev@email.com");
      }
      else return res.redirect('/users/signIn');
    }

    req.session.save(() => {
      res.locals.user = req.session.user;
      // console.log(res.locals.user)
      next();
    })
  })


// router.get('/layout', (req, res) => res.render('layout/layout'));
// 알람 체크
router.get('/checkAlarm', usersController.checkAlarm);

// 사용자 대시보드
router.use('/dashboard', (req, res) => res.render('dashboard/dashboard'));

// 사용자 접속해제
router.get('/signOut', usersController.logout);

// 사용자 마이페이지
router.get('/myPage', (req, res) => res.render('users/myPage'));

// 사용자 계정
router
  .post('/myAccount', upload().single('profileImagePath'), usersController.edit)
  .put('/myAccount', upload().single('profileImagePath'), usersController.edit)
  .get('/myAccount', (req, res) => res.render('users/myAccount'));

// news
router.use('/news', newsRouter)

// Community
router.use('/community', communityRouter)

// My Project
router.use('/myProject', myProjectRouter)

// New Project
router.use('/newProject', newProjectRouter)

module.exports = router;
