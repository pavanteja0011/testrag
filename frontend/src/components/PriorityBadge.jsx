import React from 'react';

const PRIORITY_CONFIG = {
  low:    { label: 'LOW',    cls: 'priority-low' },
  medium: { label: 'MEDIUM', cls: 'priority-medium' },
  high:   { label: 'HIGH',   cls: 'priority-high' },
  urgent: { label: 'URGENT', cls: 'priority-urgent' },
};

const PriorityBadge = ({ priority }) => {
  const cfg = PRIORITY_CONFIG[priority] || { label: priority?.toUpperCase(), cls: 'priority-medium' };
  return <span className={`priority-badge ${cfg.cls}`}>{cfg.label}</span>;
};

export default PriorityBadge;
