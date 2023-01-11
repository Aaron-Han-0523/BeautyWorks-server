const express = require("express");
const router = express.Router();

var createError = require("http-errors");

const communityRouter = require("./community");
const newsRouter = require("./news");
const formulaRouter = require("./formula");
const projectsRouter = require("./projects");
const ingredientRouter = require("./ingredient");
const packagingRouter = require("./packaging");
const documentsRouter = require("./documents");

const adminController = require("../controllers/admin");
const usersController = require("../controllers/users");

const usersService = require("../services/users");
const myUtils = require("../utils/myUtils");
const codezip = require("../codezip");

/* GET users listing. */

// 사용자 접속
router.post("/login", adminController.login).get("/login", (req, res, next) => {
  if(req.session.suer){
    res.redirect(codezip.url.admin.users)
  }else{
    res.render("admin/login");
  }
});

////////////////////////////////////
//    관리자 로그인 필요한 곳      //
////////////////////////////////////
router.use(async (req, res, next) => {
  console.log("admin env :", process.env.NODE_ENV);

  if (!req.session.user) {
    if (process.env.NODE_ENV == "development") {
      console.log("development env auto access");
      req.session.user = await usersService.getUser({ email: "superadmin" });
      // return res.redirect('/users/signIn');
    } else return next();
  }

  req.session.save(() => {
    const user = req.session.user;
    // console.log(user);
    if (![100, 200].includes(user.user_type)) {
      return next(createError(404));
    }

    res.locals.user = user;
    // console.log(res.locals.user)
    next();
  });
});

// 사용자 비밀번호 변경
router.get("/changingPassword", (req, res) => {
  res.render("admin/account/changingPassword");
});

// 사용자 접속 종료
router.get("/logout", adminController.logout);

// 이용자 관리
router
  .get("/users/add", (req, res) => res.render("admin/users/add"))
  .post("/users/add", usersController.add)

  .get("/users", adminController.index)
  .get("/users/:id", adminController.detail)
  .get("/users/delete/:id", adminController.delete)
  .get("/users/recovery/:id", adminController.recovery)
  .post("/users/checkEmail", adminController.checkEmail)
  .post(
    "/users/:id",
    myUtils.upload("profileImage").single("profile_image_path"),
    adminController.edit
  );

// news
router.use("/news", newsRouter);

// Community
router.use("/community", communityRouter);

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

router.get("/", (req, res, next) => {
  console.log;
  if (req.session.user) {
    res.redirect(codezip.url.admin.users.main);
  } else {
    res.redirect(codezip.url.admin.login);
  }
});

module.exports = router;
