const express = require('express');
const { createTask, listTasks, getTask, updateTaskStatus, updateTask, deleteTask, bulkUpdateStatus } = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);
router.post('/',              createTask);
router.get('/',               listTasks);
router.get('/:id',            getTask);
router.patch('/:id/status',   updateTaskStatus);
router.patch('/:id',          updateTask);
router.delete('/:id',         deleteTask);
router.patch('/bulk/status',  bulkUpdateStatus);
module.exports = router;
