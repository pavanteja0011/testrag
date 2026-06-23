const express = require('express');
const { createProject, listProjects, getProject, updateProject, inviteMember, archiveProject, getActivityFeed } = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const { requireProjectRole } = require('../middleware/rbac');

const router = express.Router();
router.use(authenticate);
router.post('/',                            createProject);
router.get('/',                             listProjects);
router.get('/:id',                          getProject);
router.patch('/:id',       requireProjectRole('admin'), updateProject);
router.post('/:id/members',requireProjectRole('admin'), inviteMember);
router.delete('/:id',      requireProjectRole('admin'), archiveProject);
router.get('/:id/activity',requireProjectRole('viewer'), getActivityFeed);
module.exports = router;
