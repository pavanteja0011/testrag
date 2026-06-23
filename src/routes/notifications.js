const express = require('express');
const { listNotifications, markRead, updatePreferences } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);
router.get('/',              listNotifications);
router.patch('/:id/read',   markRead);
router.put('/preferences',  updatePreferences);
module.exports = router;
