const express = require('express');
const router = express.Router();

const communityController = require('../controllers/communities');
const replyRouter = require('./communityReply');
const communityService = require('../services/communities');

/* GET community listing. */
// 추가
router
  .post('/add', communityController.add)
  .get('/add', (req, res, next) => { res.render('community/add') })

// 편집
router
  .put('/edit/:id', communityController.edit)
  .post('/edit/:id', communityController.edit)
  .get('/edit/:id', async (req, res, next) => {
    const base = req.originalUrl.split('/')[1];
    const data = await communityService.readOne(req.params.id);
    if (!(res.locals.user.id == data.users_id || [100, 200].includes(res.locals.user.user_type))) return res.status(403).end();
    if (base == 'users') {
      return res.render('community/edit', {
        data: data
      });
    } else if (base == 'admin') {
      return res.render('admin/community/edit', {
        data: data
      });
    }
  })

// 삭제
router
  .get('/delete/:id', communityController.delete)

// 복구
router
  .get('/recovery/:id', communityController.recovery)

// 상세 조회
router
  .get('/:id', communityController.detail)

// 좋아요
router
  .post('/like', communityController.like)

// 댓글
router
  .use('/reply', replyRouter)

// 목록 조회
router
  .get('/', communityController.index)

module.exports = router;
