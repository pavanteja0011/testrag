import React from 'react';

const STATUS_CONFIG = {
  'todo':        { label: 'TODO',        cls: 'status-todo' },
  'in-progress': { label: 'IN PROGRESS', cls: 'status-in-progress' },
  'in-review':   { label: 'IN REVIEW',   cls: 'status-in-review' },
  'done':        { label: 'DONE',        cls: 'status-done' },
  'cancelled':   { label: 'CANCELLED',   cls: 'status-cancelled' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status?.toUpperCase(), cls: 'status-todo' };
  return <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>;
};

export default StatusBadge;
