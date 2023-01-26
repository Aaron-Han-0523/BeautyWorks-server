const projectsService = require("../services/projects");
const documentsService = require("../services/documents");
const usersService = require("../services/users");
const myUtils = require("../utils/myUtils");


exports.add = async (req, res, next) => {
  const user = res.locals.user;
  let body = req.body;
  body.users_id = user.id;

  const id = req.query.n;
  console.log(req.query);
  if (id) {
    body.id = id;
  } else {
    body.project_name = "New Project - " + myUtils.formatDate(new Date());
    body.brand_name = user.brand_name;
    body.id = await projectsService
      .maxId({ users_id: user.id })
      .then((result) => {
        if (result === null) {
          return 1;
        } else {
          return result + 1;
        }
      });
  }
  console.log(body);

  await projectsService
    .upsert(body)
    .then((created_obj) => {
      res.status(201).json(created_obj.id);
    })
    .catch((err) => {
      console.log("fail to create projects");
      console.log(body);
      console.error(err);
      res.status(500).end();
    });
};


exports.edit = async (req, res, next) => {
  console.log("Project edit");
  const base = req.baseUrl.split("/")[1];
  const user = res.locals.user;
  const id = +req.query.n || +req.params.id;
  console.log(id);
  if (!id) {
    console.error("Need to project id");
    return;
  }

  let body = req.body;
  for ([key, value] of Object.entries(body)) {
    if (!value) body[key] = null;
  }

  let condition = { id: id };
  if (base == "users") {
    condition.users_id = user.id;
    let target = await projectsService.readOne(condition);
    if (
      body.phase == 0 &&
      [0].includes(target.phase) &&
      target.detail_phase > body.detail_phase
    ) {
      delete body.detail_phase;
    }
  } else if (base == "admin") {
    condition.users_id = +req.params.id;
  }

  console.log("files", req.files);

  if (req.files) {
    const files = req.files;
    for (key in files) {
      let paths = [];
      files[key].forEach((item, index) => {
        paths.push("/" + item.path);
      });
      body[key] = paths.join(",");
    }
  }

  console.log(Object.assign(body, condition));
  let document = documentsService.upsert(Object.assign(body, condition));
  let project = projectsService.update(body, condition);

  Promise.all([project, document])
    .then((result) => {
      res.redirect("back");
      if (base == "admin") {
        usersService.update(
          { is_project_update: 1 },
          { id: condition.users_id }
        );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.delete = async (req, res, next) => {
  const id = req.query.n;
  let condition = { users_id: req.params.id, id: id };

  await projectsService
    .hide(condition)
    .then((result) => {
      if (result == 1) {
        res.status(200).end();
      } else if (result == 0) {
        res.status(400).send("Nothing to delete data.");
      } else {
        throw new Error("Something to wrong!! check to project delete");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.recovery = async (req, res, next) => {
  const id = req.query.n;
  let condition = { users_id: req.params.id, id: id };

  await projectsService
    .show(condition)
    .then((result) => {
      if (result == 1) {
        res.status(200).end();
      } else if (result == 0) {
        res.status(400).send("Nothing to delete data.");
      } else {
        throw new Error("Something to wrong!! check to project recovery");
      }
    })
    .catch((err) => {
      res.status(500).end();
    });
};


exports.index = async (req, res, next) => {
  const user = res.locals.user;

  let condition = {};
  condition.users_id = user.id;
  condition.delete_date = null;

  const page = +req.query.p || 1;
  const limit = +req.query.limit || 4;
  const skip = (page - 1) * limit;

  const project = projectsService.allRead(
    Object.assign(condition, { phase: [1, 8] })
  );
  const temp_project = projectsService.allRead(
    Object.assign(condition, { phase: 0 })
  );
  const completed_project = projectsService.allRead(
    Object.assign(condition, { phase: 9 }),
    limit,
    skip
  );

  Promise.all([project, temp_project, completed_project])
    .then(([project, temp_project, completed_project]) => {
      res.render("myProject/main", {
        page: page,
        project: project,
        temp_project: temp_project,
        completed_project: completed_project,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.temp_projects = async (req, res, next) => {
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  let condition = { phase: 0 };
  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    condition.users_id = user.id;
    condition.delete_date = null;
  } else {
    condition.users_id = req.params.id;
  }

  const page = +req.query.p || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  projectsService
    .allRead(condition, limit, skip)
    .then((result) => {
      result.page = page;
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.progress_projects = async (req, res, next) => {
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  let condition = { phase: [1, 8] };
  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    condition.users_id = user.id;
    condition.delete_date = null;
  } else {
    condition.users_id = req.params.id;
  }

  const page = +req.query.p || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  projectsService
    .allRead(condition, limit, skip)
    .then((result) => {
      result.page = page;
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.completed_projects = async (req, res, next) => {
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  let condition = { phase: 9 };
  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    condition.users_id = user.id;
    condition.delete_date = null;
  } else {
    condition.users_id = req.params.id;
  }

  const page = +req.query.p || 1;
  const limit = +req.query.limit || 4;
  const skip = (page - 1) * limit;

  projectsService
    .allRead(condition, limit, skip)
    .then((result) => {
      result.page = page;
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.detail = async (req, res, next) => {
  const id = req.query.n;
  let condition = { id: id };
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    condition.users_id = user.id;
    condition.delete_date = null;
  } else {
    condition.users_id = req.params.id;
  }

  projectsService
    .readOne(condition)
    .then((result) => {
      console.log("find :", result);
      if (req.api) {
        res.json({ project: result });
      } else if (base == "users") {
        res.render("newProject/draft", { project: result || {} });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.temp_project_detail = async (req, res, next) => {
  const id = req.query.n;
  let condition = { id: id };
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    return res.status(403).end();
  } else {
    condition.users_id = req.params.id;
  }

  projectsService
    .readOne(condition)
    .then((result) => {
      console.log("find :", result);
      if (req.api) {
        res.json({ project: result });
      } else if (base == "admin") {
        res.render("admin/project/temp_project", {
          project: result,
          users_id: condition.users_id,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.progress_project_detail = async (req, res, next) => {
  const id = req.query.n;
  let condition = { id: id };
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    return res.status(403).end();
  } else {
    condition.users_id = req.params.id;
  }

  projectsService
    .readOne(condition)
    .then((result) => {
      console.log("find :", result);
      if (req.api) {
        res.json({ project: result });
      } else if (base == "admin") {
        res.render("admin/project/progress_project", {
          project: result,
          users_id: condition.users_id,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};


exports.completed_project_detail = async (req, res, next) => {
  const id = req.query.n;
  let condition = { id: id };
  const user = res.locals.user;
  const base = req.baseUrl.split("/")[1];

  if (!(base == "admin" && [100, 200].includes(user.user_type))) {
    return res.status(403).end();
  } else {
    condition.users_id = req.params.id;
  }

  projectsService
    .readOne(condition)
    .then((result) => {
      console.log("find :", result);
      if (req.api) {
        res.json({ project: result });
      } else if (base == "admin") {
        res.render("admin/project/completed_project", {
          project: result,
          users_id: condition.users_id,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
};
