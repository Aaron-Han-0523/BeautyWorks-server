const usersService = require("../services/users");
const projectsService = require("../services/projects");
const formulasService = require("../services/formulas");
const like_formulasService = require("../services/like_formulas");
const ingredientsService = require("../services/ingredients");
const newsService = require("../services/news");
const communitiesService = require("../services/communities");
const like_communitiesService = require("../services/like_communities");
const like_repliesService = require("../services/like_replies");
const nodemailer = require("nodemailer");
const systemInfo = require("../config/system.json");
const encryption = require("../utils/encryption");
const { getRandomInt } = require("../utils/myUtils");
const { Op } = require("sequelize");
const codezip = require("../codezip");

exports.login = async function (req, res, next) {
  const body = req.body;

  console.log("try", body.email, "login by", req.ip);

  const user = await usersService.getUser({
    email: body.email,
    delete_date: null,
  });

  const hashedPassword = await encryption.hashing(body.password);

  if (user) {
    if (user.user_type === 0) {
      return res.send(
        `<script> alert("${res.__(
          "msg.waitingSubscriptionApproval"
        )}"); location.href = document.referrer; </script>`
      );
    } else if (user.password == hashedPassword) {
      console.log(body.email, "connect");
      delete user.password;
      req.session.user = user;

      //세션 스토어가 이루어진 후 redirect를 해야함.
      req.session.save(() => {
        return res.redirect("/");
      });
    } else {
      console.log("비밀번호 불일치");
      return res.send(
        `<script> alert("${res.__(
          "msg.checkIdAndPassword"
        )}"); location.href = document.referrer; </script>`
      );
    }
  } else {
    console.log("아이디 없음");
    return res.send(
      `<script> alert("${res.__(
        "msg.checkIdAndPassword"
      )}"); location.href = document.referrer; </script>`
    );
  }
};


exports.logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("로그아웃 : 세션 삭제 실패");
      return res.status(500).end();
    }
    console.log("세션 삭제 완료");
    return res.redirect("/users/signIn");
  });
};


exports.validationEmail = async (req, res, next) => {
  const targetEmail = req.body.email.toLowerCase();

  const isEmail = await usersService
    .getUser({ email: targetEmail })
    .then((result) => {
      if (result) {
        return true;
      } else {
        return false;
      }
    });
  if (isEmail) {
    return res.status(400).send("The email exists.");
  }

  const transporter = nodemailer.createTransport({
    service: systemInfo.emailService,
    auth: {
      user: systemInfo.emailUserid,
      pass: systemInfo.emailPassword,
    },
  });

  let validationNumber = ("000000" + parseInt((Math.random() * 1000000) / 1)).slice(-6);

  let mailOptions = {
    from: systemInfo.systemEmailName + "<" + systemInfo.emailUserid + ">",
    to: targetEmail,
    subject: res.__("users.signUp.validationMailTitle"),
    text:
      res.__("users.signUp.validationMailcontents") + "\n" + validationNumber,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      return res.status(500).send(error);
    } else {
      console.log("Email sent: " + info.accepted);
      return res.json(validationNumber);
    }
  });
};


exports.add = async (req, res, next) => {
  const base = req.baseUrl.split("/")[1];

  let body = req.body;
  body.password = await encryption.hashing(body.password);
  body.user_type = 0;
  if (!body.email) {
    body.email = (body.emailId + "@" + body.emailDomain).toLowerCase();
  }
  if (!body.mobile_contact) {
    body.mobile_contact = body.country_number + ")" + body.phoneNum.trim();
  }
  body.first_name = body.first_name.trim();
  body.last_name = body.last_name.trim();

  const user = await usersService.getUser({
    first_name: body.first_name,
    last_name: body.last_name,
    mobile_contact: body.mobile_contact,
  });

  if (user) return res.status(409).send(user.email);

  console.log("Users body :", body);

  usersService
    .create(body)
    .then((result) => {
      if (req.api) {
        return res.status(201).json(result.id);
      } else if (base == "users") {
        return res.status(201).redirect(codezip.url.users.signIn);
      } else if (base == "admin") {
        return res.status(201).redirect(codezip.url.admin.users.main);
      }
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).end(e);
    });
};


exports.edit = async (req, res, next) => {
  console.log("users edit");

  const user = res.locals.user;

  let body = req.body;
  if (body.isRemoveImage == "true") {
    body.profile_image_path = codezip.url.users.defaultProfileImage;
    console.log("default profile image path :", body.profile_image_path);
  } else {
    let file = req.file;
    if (file) body[file.fieldname] = "/" + file.path;
  }

  return usersService
    .update(body, { id: user.id })
    .then((result) => {
      console.log("update result :", result);
      res.redirect("back");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send();
    });
};


exports.checkAlarm = async (req, res, next) => {
  console.log("user check alram");

  const user = res.locals.user;

  let body = {};
  body.is_project_update = false;

  usersService
    .update(body, { id: user.id })
    .then((result) => {
      console.log("update data count :", result);
      return res.redirect(codezip.url.users.myProject.main);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send();
    });
};


exports.main = async (req, res) => {
  const user = res.locals.user;

  let condition = {};
  condition.users_id = user.id;
  condition.delete_date = null;

  const page = +req.query.p || 1;
  const limit = +req.query.limit || 4;
  const skip = (page - 1) * limit;

  const project = projectsService.allRead(
    Object.assign(condition, { phase: [1, 8] }),
    3
  );
  const temp_project = projectsService.allRead(
    Object.assign(condition, { phase: 0 }),
    2
  );
  const completed_project = projectsService.allRead(
    Object.assign(condition, { phase: 9 }),
    limit,
    skip
  );

  const recommended_formula = formulasService
    .allRead({ delete_date: null })
    .then((result) => {
      let data = [];
      let random_index = [];
      while (random_index.length < 3) {
        let n = getRandomInt(result.count);
        if (!random_index.includes(n)) random_index.push(n);
      }
      for (let i = 0; i < random_index.length; i++) {
        data.push(result.rows[random_index[i]]);
      }
      return data;
    });
  const recommended_ingredient = ingredientsService
    .allRead({ delete_date: null })
    .then((result) => {
      let data = [];
      let random_index = [];
      while (random_index.length < 4) {
        let n = getRandomInt(result.count);
        if (!random_index.includes(n)) random_index.push(n);
      }
      for (let i = 0; i < random_index.length; i++) {
        data.push(result.rows[random_index[i]]);
      }
      return data;
    });

  const news = newsService.allRead(
    { delete_date: null },
    { skip: 0, limit: 2 }
  );
  const community = communitiesService.allRead(
    { delete_date: null },
    { skip: 0, limit: 2 }
  );

  Promise.all([
    project,
    temp_project,
    completed_project,
    recommended_formula,
    recommended_ingredient,
    news,
    community,
  ])
    .then(
      ([
        project,
        temp_project,
        completed_project,
        recommended_formula,
        recommended_ingredient,
        news,
        community,
      ]) => {
        res.render("dashboard/dashboard", {
          page: page,
          project: project.rows,
          temp_project: temp_project.rows,
          completed_project: completed_project,
          recommended_formula: recommended_formula,
          recommended_ingredient: recommended_ingredient,
          news: news.rows,
          community: community.rows,
        });
      }
    )
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.myPage = async (req, res, next) => {
  const user = res.locals.user;

  const myWishList = like_formulasService
    .getLikelist(user.id)
    .then((result) => {
      if (result.list) {
        return formulasService.allRead({ id: result.list });
      } else {
        return {};
      }
    });
  const myFavoritePosts = like_communitiesService
    .getLikelist(user.id)
    .then((result) => {
      if (result.list) {
        return communitiesService.allRead({ id: result.list });
      } else {
        return {};
      }
    });
  const myFavoriteComments = like_repliesService.getLikelist(user.id);
  const myPost = communitiesService.allRead({
    users_id: user.id,
    delete_date: null,
  });

  Promise.all([myPost, myWishList, myFavoritePosts, myFavoriteComments])
    .then(([myPost, myWishList, myFavoritePosts, myFavoriteComments]) => {
      console.log("11", myPost);
      console.log("22", myWishList);
      console.log("33", myFavoritePosts);
      // console.log("44", (myFavoriteComments));

      return res.render("users/myPage");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.index = async (req, res, next) => {
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    return res.status(403).end();
  }

  const page = +req.query.p || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  let condition = {
    id: { [Op.ne]: 1 },
  };

  usersService
    .allRead(condition, limit, skip)
    .then((result) => {
      if (req.api) {
        return res.json({
          users: result,
          page: page,
        });
      } else if (base == "admin") {
        return res.render("admin/users/index", {
          users: result,
          page: page,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).end();
    });
};


exports.changingPassword = async (req, res, next) => {
  const userInfo = res.locals.user;
  // console.log("user information :", userInfo);
  const body = req.body;
  console.log("body :", body);

  const user = await usersService.getUser({ email: userInfo.email });
  // console.log("user :", user);
  if (!user) return res.status(404).end();

  const hashedPassword = await encryption.hashing(body.currentPassword);

  if (hashedPassword == user.password) {
    const newHashedPassword = await encryption.hashing(body.newPassword);

    await usersService
      .update({ password: newHashedPassword }, { email: userInfo.email })
      .then((result) => {
        return res.end();
      })
      .catch((err) => console.error(err));
  } else return res.status(403).end();
};


exports.resetPassword = async (req, res, next) => {
  const body = req.body;
  body.mobile_contact = body.country_number + ")" + body.phoneNum;
  console.log("body :", body);

  const user = await usersService.getUser({ email: body.email });
  // console.log("user :", user);
  if (!user) return res.status(404).end();

  if (
    body.first_name == user.first_name &&
    body.last_name == user.last_name &&
    body.mobile_contact == user.mobile_contact
  ) {
    let newPassword = "";
    for (let i = 0; i < 4; i++) {
      newPassword += getRandomInt(10);
    }
    console.log(newPassword);

    const hashedPassword = await encryption.hashing(newPassword);

    await usersService
      .update({ password: hashedPassword }, { email: body.email })
      .then((result) => {
        const transporter = nodemailer.createTransport({
          service: systemInfo.emailService,
          auth: {
            user: systemInfo.emailUserid,
            pass: systemInfo.emailPassword,
          },
        });

        let mailOptions = {
          from: systemInfo.systemEmailName + "<" + systemInfo.emailUserid + ">",
          to: body.email,
          subject: res.__("mail.ResetPasswordMailTitle"),
          text: res.__("mail.ResetPasswordMailcontent") + "\n" + newPassword,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.error(error);
            return res.status(500).send(error);
          } else {
            console.log("Email sent: " + info.accepted);
            return res.end();
          }
        });
      })
      .catch((err) => console.error(err));
  } else return res.status(403).end();
};


exports.findEmail = async (req, res, next) => {
  const body = req.body;
  body.mobile_contact = body.country_number + ")" + body.phoneNum.trim();
  console.log("body :", body);

  const user = await usersService.getUser({
    first_name: body.first_name.trim(),
    last_name: body.last_name.trim(),
    mobile_contact: body.mobile_contact,
  });
  if (!user) return res.status(404).end();

  return res.send(user.email);
};
