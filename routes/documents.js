const express = require('express');
const router = express.Router();

const documentsController = require('../controllers/documents')

// 상세 조회
router.get('/:id', documentsController.detail);

// 목록 조회
router.get('/', documentsController.index);


module.exports = router;