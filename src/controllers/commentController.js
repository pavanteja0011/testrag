const Comment = require('../models/Comment');
const Task = require('../models/Task');

const addComment = async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: 'Comment content is required' });
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const comment = await Comment.create({ task: req.params.taskId, author: req.user._id, content: content.trim() });
  await comment.populate('author', 'name avatarColor');
  return res.status(201).json(comment);
};

const listComments = async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('author', 'name avatarColor').sort({ createdAt: 1 }).lean();
  return res.json({ comments, total: comments.length });
};

// NOT IMPLEMENTED — needs 24h edit window and ownership check (REQ-023)
const editComment = (req, res) =>
  res.status(501).json({ error: 'Comment editing is not yet implemented. Coming in v1.1.' });

// NOT IMPLEMENTED — needs ownership or admin check (REQ-024)
const deleteComment = (req, res) =>
  res.status(501).json({ error: 'Comment deletion is not yet implemented. Coming in v1.1.' });

module.exports = { addComment, listComments, editComment, deleteComment };
