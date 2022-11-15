const express = require('express');
const router = express.Router();

const replyController = require('../controllers/replies');

/* GET community listing. */
// 추가
router
    .post('/add/:id', replyController.add)

// 편집
router
    .put('/edit', replyController.edit)
    .post('/edit', replyController.edit)

// 삭제
router
    .get('/delete//:community_id/:reply_id', replyController.delete)
    .delete('/:community_id/:reply_id', replyController.delete)

// 좋아요
router
    .post('/like', replyController.like)

module.exports = router;
