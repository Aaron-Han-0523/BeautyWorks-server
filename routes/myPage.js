const express = require('express');
const router = express.Router();

const myPageController = require('../controllers/myPage');

router.get('/', (req, res) => res.render('users/myPage'));
router.get('/wishList', myPageController.wishList);
router.get('/myPosts', myPageController.myPosts);
router.get('/favoritePosts', myPageController.favoritePosts);
router.get('/favoriteComments', myPageController.favoriteComments);

module.exports = router