const express = require('express');
const { addComment, listComments, editComment, deleteComment } = require('../controllers/commentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });
router.use(authenticate);
router.post('/',      addComment);
router.get('/',       listComments);
router.patch('/:id',  editComment);
router.delete('/:id', deleteComment);
module.exports = router;
