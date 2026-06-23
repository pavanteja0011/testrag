// ALL notification endpoints are 501 stubs.
// Notifications require an email delivery service and push system. Planned for v1.1.
// REQ-026 through REQ-030 are all unimplemented.

const listNotifications    = (req, res) => res.status(501).json({ error: 'Notifications not implemented. Coming in v1.1.' });
const markRead             = (req, res) => res.status(501).json({ error: 'Notifications not implemented. Coming in v1.1.' });
const updatePreferences    = (req, res) => res.status(501).json({ error: 'Notification preferences not implemented. Coming in v1.1.' });

module.exports = { listNotifications, markRead, updatePreferences };
