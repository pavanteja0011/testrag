import React from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

// Shows compact task info for dashboard lists and kanban boards
const TaskCard = ({ task, showOverdueBadge }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done' && task.status !== 'cancelled';

  return (
    <div className={`task-card${isOverdue ? ' task-card--overdue' : ''}`}>
      <div className="task-card__top">
        <span className="task-card__title">{task.title}</span>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="task-card__bottom">
        <StatusBadge status={task.status} />
        {task.assignee && (
          <span className="assignee-avatar" style={{ background: task.assignee.avatarColor }}>
            {task.assignee.name?.[0]?.toUpperCase()}
          </span>
        )}
        {task.dueDate && (
          <span className={`due-date${isOverdue ? ' due-date--overdue' : ''}`}>
            {isOverdue && showOverdueBadge && <span className="overdue-badge">OVERDUE</span>}
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
