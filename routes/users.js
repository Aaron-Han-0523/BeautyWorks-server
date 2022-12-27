const express = require("express");
const router = express.Router();
var logger = require("morgan");

const communityRouter = require("./community");
const newsRouter = require("./news");
const newProjectRouter = require("./newProject");
const myProjectRouter = require("./myProject");
const formulaRouter = require("./formula");
const projectsRouter = require("./projects");
const ingredientRouter = require("./ingredient");
const myPageRouter = require("./myPage");
const packagingRouter = require("./packaging");
const documentsRouter = require("./documents");

const usersController = require("../controllers/users");

const usersService = require("../services/users");

const multer = require("multer");
const path = require("path");
const myUtils = require("../utils/myUtils");
const codezip = require("../codezip");
const { __ } = require("i18n");

const directory_name = "profileImage";

// 업로드 파일 저장 설정
let storage = (fileName) =>
  multer.diskStorage({
    destination: function (req, file, callback) {
      const FILES_PATH = path.join(
        process.env.UPLOADFILES_ROOT,
        directory_name
      );
      const FOLDER_PATH = path.join(process.cwd(), FILES_PATH);
      myUtils.mkdir(FOLDER_PATH);

      callback(null, FILES_PATH);
    },
    filename: function (req, file, callback) {
      let extension = path.extname(file.originalname);
      let basename = path.basename(file.originalname, extension);
      let encoding = "";
      for (let i = 0; i < basename.length; i++) {
        encoding += basename.codePointAt(i).toString(16);
      }
      encoding = encoding.slice(0, 200);
      callback(
        null,
        req.res.locals.user.id + "-" + Date.now() + "-" + encoding + extension
      );
    },
  });

// 미들웨어 등록
const upload = (fileName) =>
  multer({
    storage: storage(fileName),
    // file size 제한(MB)
    limits: {
      fileSize: process.env.FILE_MAX_SIZE * 1024 * 1024,
    },
  });

/* GET users listing. */
// 사용자 등록
router
  .post("/signUp", usersController.add)
  .get("/signUp", (req, res, next) => res.render("users/signUp"));

// Email 확인
router.post("/validationEmail", usersController.validationEmail);

// 사용자 접속
router
  .post("/signIn", usersController.login)
  .get("/signIn", (req, res, next) => {
    res.render("users/signIn");
  });

////////////////////////////////////
//    사용자 로그인 필요한 곳      //
////////////////////////////////////
router.use(async (req, res, next) => {
  if (!req.session.user) {
    if (process.env.NODE_ENV == "development") {
      console.log("env :", process.env.NODE_ENV);
      req.session.user = await usersService.getUser({ email: "dev@email.com" });
      req.session.save(() => {
        res.locals.user = req.session.user;
        // console.log("locals.user", res.locals.user)
        next();
      });
    } else return res.redirect("/users/signIn");
  } else {
    const user = await usersService.readOne({ id: req.session.user.id });
    res.locals.user = user;
    next();
  }
});

logger.token("remote-user", (req, res) => {
  if (res.locals.user) {
    return res.locals.user.email;
  }
});

// let logger_setting = ':req[X-Real-IP] :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":user-agent" :response-time ms';

// let logger_option = {
//   skip: function (req, res) { return res.statusCode == 304 }
// }

// if (process.env == 'development') router.use(logger(logger_setting, logger_option));
// else router.use(logger(logger_setting));

// 사용자 접속해제
router.get("/signOut", usersController.logout);

// router.get('/layout', (req, res) => res.render('layout/layout'));
// 알람 체크
router.get("/checkAlarm", usersController.checkAlarm);

// 사용자 대시보드
router.use("/dashboard", usersController.main);

// 사용자 마이페이지
router.use("/myPage", myPageRouter);

// 사용자 계정
router
  .post(
    "/myAccount",
    upload().single("profile_image_path"),
    usersController.edit
  )
  .put(
    "/myAccount",
    upload().single("profile_image_path"),
    usersController.edit
  )
  .get("/myAccount", (req, res) => res.render("users/myAccount"));

// news
router.use("/news", newsRouter);

// Community
router.use("/community", communityRouter);

// My Project
router.use("/myProject", myProjectRouter);

// New Project
router.use("/newProject", newProjectRouter);

// Formula
router.use("/formula", formulaRouter);

// Packaing
router.use("/packaging", packagingRouter);

// Ingredient
router.use("/ingredient", ingredientRouter);

// Documents
router.use("/documents", documentsRouter);

// Projects
router.use("/projects", projectsRouter);

router.get("/", (req, res, next) => res.redirect(codezip.url.users.dashboard));

// api
router.use(
  "/api",
  (req, res, next) => {
    console.log("api request");
    req.api = true;
    next();
  },
  router
);

module.exports = router;
