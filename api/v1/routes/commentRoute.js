var express = require('express');
var CommentController = require('../controllers/commentController.js');
var router = express.Router();

router.get('/', CommentController.all_comments);
router.get('/:id', CommentController.load_comment);
router.post('/', CommentController.create_comment);
router.delete('/:id', CommentController.delete_comment);

module.exports = router;
