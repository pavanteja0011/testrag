const Task = require('../models/Task');
const { STATUS_TRANSITIONS } = require('../models/Task');

const createTask = async (req, res) => {
  const { title, description, projectId, assigneeId, priority, dueDate, tags } = req.body;
  if (!title || !projectId) return res.status(400).json({ error: 'title and projectId required' });
  const task = await Task.create({
    title, description: description || '', project: projectId,
    assignee: assigneeId || null, priority: priority || 'medium',
    dueDate: dueDate ? new Date(dueDate) : null, tags: tags || [],
    createdBy: req.user._id,
  });
  return res.status(201).json(task);
};

const listTasks = async (req, res) => {
  const { projectId, status, priority, assignee } = req.query;
  const filter = {};
  if (projectId) filter.project = projectId;
  if (status)    filter.status = status;
  if (priority)  filter.priority = priority;
  if (assignee)  filter.assignee = assignee;
  const tasks = await Task.find(filter)
    .populate('assignee', 'name avatarColor')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 }).lean();
  return res.json({ tasks, total: tasks.length });
};

const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignee', 'name email avatarColor')
    .populate('createdBy', 'name').lean();
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json(task);
};

const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const allowed = STATUS_TRANSITIONS[task.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `Cannot move from ${task.status} to ${status}. Allowed: ${allowed.join(', ')}` });
  }
  task.status = status;
  await task.save();
  return res.json(task);
};

const updateTask = async (req, res) => {
  const allowed = ['title', 'description', 'assignee', 'priority', 'dueDate', 'tags'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  return res.json(task);
};

// NOT IMPLEMENTED — requires cascade delete of all comments (REQ-019)
const deleteTask = (req, res) =>
  res.status(501).json({ error: 'Task deletion is not yet implemented. Coming in v1.1.' });

// NOT IMPLEMENTED — requires transaction support for atomicity (REQ-020)
const bulkUpdateStatus = (req, res) =>
  res.status(501).json({ error: 'Bulk status update is not yet implemented. Coming in v1.1.' });

module.exports = { createTask, listTasks, getTask, updateTaskStatus, updateTask, deleteTask, bulkUpdateStatus };
