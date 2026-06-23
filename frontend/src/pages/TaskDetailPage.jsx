import React, { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CommentList from '../components/CommentList';

// TaskDetailPage — full task view with status transitions, metadata, comments.
// File attachments are NOT implemented (REQ-031).
// Delete task is NOT implemented — calls 501 endpoint (REQ-019).
const ALLOWED_TRANSITIONS = {
  'todo':        ['in-progress', 'cancelled'],
  'in-progress': ['in-review', 'todo', 'cancelled'],
  'in-review':   ['done', 'in-progress', 'cancelled'],
  'done':        ['in-progress'],
  'cancelled':   ['todo'],
};

const TaskDetailPage = ({ taskId, token }) => {
  const [task, setTask] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadTask = () =>
    fetch(`/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then(setTask);

  useEffect(() => { loadTask(); }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    await loadTask();
    setUpdating(false);
  };

  if (!task) return <div className="loading-spinner">Loading task...</div>;

  return (
    <div className="task-detail-page">
      <div className="task-detail-header">
        <h1 className="task-title">{task.title}</h1>
        <div className="task-badges"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
      </div>
      <div className="task-meta">
        <span>Assignee: {task.assignee?.name || 'Unassigned'}</span>
        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
        <span>Created by: {task.createdBy?.name}</span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="status-actions">
        <span className="status-label">Move to:</span>
        {(ALLOWED_TRANSITIONS[task.status] || []).map((s) => (
          <button key={s} className={`btn-status btn-status-${s.replace('-', '')}`} onClick={() => handleStatusChange(s)} disabled={updating}>{s}</button>
        ))}
      </div>
      <div className="attachments-section">
        <h3>Attachments</h3>
        <p className="coming-soon-text">File attachments coming in v1.1 (REQ-031)</p>
      </div>
      <CommentList taskId={taskId} token={token} />
    </div>
  );
};

export default TaskDetailPage;
