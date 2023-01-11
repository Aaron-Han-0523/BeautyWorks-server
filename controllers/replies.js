const repliesService = require('../services/replies');
const likeService = require('../services/like_replies');
const codezip = require('../codezip');


exports.add = async (req, res, next) => {
    let body = req.body;
    body.communities_id = req.params.id;
    body.users_id = res.locals.user.id;
    console.log("reply body :", body);
    console.log("referer :", req.headers.referer);

    await repliesService.create(body)
        .then(result => {
            if (req.api) {
                return res.json(result.id);
            } else {
                return res.redirect("back")
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send(err);
        })
}


exports.edit = async (req, res, next) => {
    console.log("reply edit");
    const user = res.locals.user;
    const base = req.originalUrl.split('/')[1]
    let body = req.body;

    if (!(base == "admin" && [100, 200].includes(user.user_type))) {
        const target = await repliesService.readOne(body);
        if (user.id != target.users_id) {
            return res.status(403).end();
        }
    }

    console.log("reply edit body :", body);

    repliesService.update(body)
        .then(result => {
            console.log(result);
            return res.end();
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send(err);
        });
}


exports.delete = async (req, res, next) => {
    console.log("reply delete");
    const user = res.locals.user;
    const base = req.originalUrl.split('/')[1]
    let obj = {}
    obj.communities_id = req.params.community_id;
    obj.id = req.params.reply_id;
    if (base == "users") {
        const target = await repliesService.readOne(obj);
        if (user.id != target.users_id) {
            return res.status(403).end();
        }
    } else if (base == "admin") {
        obj.communities_id = req.params.community_id;
        obj.id = req.params.reply_id;
    }

    console.log(obj)

    let result = await repliesService
        .hide(obj)
        .then(result => {
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).end();
        });
}


exports.recovery = async (req, res, next) => {
    const communities_id = req.params.community_id;
    const id = req.params.reply_id;
    const user = res.locals.user;
    const base = req.baseUrl.split('/')[1];

    if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
        return res.status(403).end()
    }

    let condition = {
        communities_id: communities_id,
        id: id
    };

    await repliesService
        .show(condition)
        .then((result) => {
            if (result == 1) {
                res.status(200).end();
            }
            else if (result == 0) {
                res.status(400).send("Nothing to delete data.");
            }
            else {
                throw new Error("Something to wrong!! check to news recovery")
            }
        })
        .catch((err) => {
            res.status(500).end();
        })
}


exports.like = async (req, res, next) => {
    const user = res.locals.user;
    if (!user) {
        return res.status(403).redirect(codezip.url.users.signIn);
    }
    let body = Object.assign(req.body, { users_id: user.id });

    let result;
    if (body.is_like) {
        result = likeService.create(body);
    } else {
        result = likeService.delete(body);
    }

    result.then(result => {
        res.end()
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    });
}