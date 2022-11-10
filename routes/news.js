const express = require('express');
const router = express.Router();

const newsController = require('../controllers/news');
const newsService = require('../services/news');

/* GET news listing. */
// 추가
router
  .post('/add', newsController.add)
  .get('/add', (req, res, next) => res.render('news/add'))

// 편집
router
  .put('/edit/:id', newsController.edit)
  .post('/edit/:id', newsController.edit)
  .get('/edit/:id', async (req, res, next) => {
    const data = await newsService.readOne(req.params.id);
    if (res.locals.user.users_id != data.users_id) return res.status(403).end();
    return res.render('news/edit', {
      data: data
    });
  })

// 삭제
router
  .get('/delete/:id', newsController.delete)

// 상세 조회
router
  .get('/:id', newsController.detail)

// 목록 조회
router
  .get('/', newsController.index)

module.exports = router;