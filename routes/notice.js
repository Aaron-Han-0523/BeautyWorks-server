const express = require('express');
const router = express.Router();

const noticeController = require('../controllers/notice');
const noticeService = require('../services/notice');

/* GET notice listing. */
router
  .get('/add', jwt.verifyToken, (req, res, next) => res.render('notice/add', { user: req.userInfo }))
  .post('/add', jwt.verifyToken, noticeController.add)
  .get('/edit/:id', jwt.verifyToken, async (req, res, next) => res.render('notice/edit', {
    user: req.userInfo,
    data: await noticeService.readOne(req.params.id)
  }))
  .post('/edit/:id', jwt.verifyToken, noticeController.edit)
  .get('/delete/:id', jwt.verifyToken, noticeController.delete)
  .get('/search', jwt.verifyToken, noticeController.search)
  .get('/:id', jwt.verifyToken, noticeController.detail)
  .get('/', jwt.verifyToken, noticeController.index)

module.exports = router;
