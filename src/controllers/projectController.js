const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { name, description, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });
  const project = await Project.create({
    name, description: description || '', color: color || '#4f46e5',
    members: [{ userId: req.user._id, role: 'admin' }],
    createdBy: req.user._id,
  });
  return res.status(201).json(project);
};

const listProjects = async (req, res) => {
  const showArchived = req.query.archived === 'true';
  const projects = await Project.find({ 'members.userId': req.user._id, isArchived: showArchived })
    .populate('createdBy', 'name avatarColor').lean();
  return res.json({ projects, total: projects.length });
};

const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members.userId', 'name email avatarColor').lean();
  if (!project) return res.status(404).json({ error: 'Project not found' });
  return res.json(project);
};

const updateProject = async (req, res) => {
  const allowed = ['name', 'description', 'color'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const project = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  return res.json(project);
};

const inviteMember = async (req, res) => {
  const { email, role } = req.body;
  const User = require('../models/User');
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'No user with that email' });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (project.members.some((m) => m.userId.toString() === user._id.toString()))
    return res.status(409).json({ error: 'User is already a member' });
  project.members.push({ userId: user._id, role: role || 'member' });
  await project.save();
  return res.json({ message: 'Member added', project });
};

// NOT IMPLEMENTED — archive requires cascade to tasks (REQ-012)
const archiveProject = (req, res) =>
  res.status(501).json({ error: 'Project archive is not yet implemented. Coming in v1.1.' });

// NOT IMPLEMENTED — requires event logging infrastructure (REQ-013)
const getActivityFeed = (req, res) =>
  res.status(501).json({ error: 'Activity feed is not yet implemented. Coming in v1.1.' });

module.exports = { createProject, listProjects, getProject, updateProject, inviteMember, archiveProject, getActivityFeed };
