const express = require('express');
const router = express.Router();
const postController = require('../app/controllers/postController');

router.get('/posts', postController.show);
router.post('/post', postController.create);

module.exports = router;
