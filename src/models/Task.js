const mongoose = require('mongoose');

// Server-enforced status transition map (REQ-017)
const STATUS_TRANSITIONS = {
  'todo':        ['in-progress', 'cancelled'],
  'in-progress': ['in-review', 'todo', 'cancelled'],
  'in-review':   ['done', 'in-progress', 'cancelled'],
  'done':        ['in-progress'],
  'cancelled':   ['todo'],
};

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  project:     { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status:      { type: String, enum: ['todo', 'in-progress', 'in-review', 'done', 'cancelled'], default: 'todo' },
  dueDate:     { type: Date, default: null },
  tags:        [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
module.exports.STATUS_TRANSITIONS = STATUS_TRANSITIONS;
