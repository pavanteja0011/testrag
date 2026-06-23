const Project = require('../models/Project');

const ROLE_RANK = { viewer: 1, member: 2, admin: 3 };

// Attaches req.project and enforces minimum project role
const requireProjectRole = (minRole) => async (req, res, next) => {
  const projectId = req.params.id || req.params.projectId || req.body.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const membership = project.members.find((m) => m.userId.toString() === req.user._id.toString());
  if (!membership) return res.status(403).json({ error: 'Not a member of this project' });

  if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
    return res.status(403).json({ error: `Requires ${minRole} role in this project` });
  }
  req.project = project;
  req.projectRole = membership.role;
  next();
};

module.exports = { requireProjectRole, ROLE_RANK };
