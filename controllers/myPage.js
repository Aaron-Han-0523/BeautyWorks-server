const formulasService = require('../services/formulas');
const like_formulasService = require('../services/like_formulas');
const communitiesService = require('../services/communities');
const like_communitiesService = require('../services/like_communities');
const like_repliesService = require('../services/like_replies');


exports.wishList = async (req, res, next) => {
    const user = res.locals.user;

    const page = +req.query.p || 1;
    const limit = +req.query.limit || 4;
    const skip = (page - 1) * limit;

    let condition = {};
    if (req.baseUrl.split('/')[1] != 'admin') {
        condition.delete_date = null;
    }

    like_formulasService
        .getLikelist(user.id)
        .then(result => {
            if (result.list) {
                condition.id = result.list
                return formulasService.allRead(condition, limit, skip);
            } else {
                return {};
            }
        }).then(myWishList => {
            //console.log(myWishList);
            res.json(myWishList);
        }).catch(err => {
            console.error(err);
            res.status(500).end();
        });
}


exports.myPosts = async (req, res, next) => {
    const user = res.locals.user;

    const page = +req.query.p || 1;
    const limit = +req.query.limit || 4;
    const skip = (page - 1) * limit;

    let condition = { users_id: user.id };
    if (req.baseUrl.split('/')[1] != 'admin') {
        condition.delete_date = null;
    }

    communitiesService.allRead(condition, { skip: skip, limit: limit })
        .then(myPost => {
            res.json(myPost);
        }).catch(err => {
            console.error(err);
            res.status(500).end();
        });
}


exports.favoritePosts = async (req, res, next) => {
    const user = res.locals.user;

    const page = +req.query.p || 1;
    const limit = +req.query.limit || 4;
    const skip = (page - 1) * limit;

    let condition = {};
    if (req.baseUrl.split('/')[1] != 'admin') {
        condition.delete_date = null;
    }

    like_communitiesService
        .getLikelist(user.id)
        .then(result => {
            if (result.list) {
                condition.id = result.list
                return communitiesService.allRead(condition, { skip: skip, limit: limit });
            } else {
                return {};
            }
        }).then(myFavoritePosts => {
            res.json(myFavoritePosts);
        }).catch(err => {
            console.error(err);
            res.status(500).end();
        });
}


exports.favoriteComments = async (req, res, next) => {
    const user = res.locals.user;

    const page = +req.query.p || 1;
    const limit = +req.query.limit || 4;
    const skip = (page - 1) * limit;

    let condition = { users_id: user.id };
    if (req.baseUrl.split('/')[1] != 'admin') {
        condition.delete_date = null;
    }

    like_repliesService.getLikelist(condition, { skip: skip, limit: limit })
        .then(myFavoriteComments => {
            res.json(myFavoriteComments);
        }).catch(err => {
            console.error(err);
            res.status(500).end();
        });
}