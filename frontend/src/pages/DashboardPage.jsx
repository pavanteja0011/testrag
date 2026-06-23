import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';

// DashboardPage — stat cards (todo/in-progress/in-review/done/overdue) + due-today list.
// Velocity report and CSV export are NOT implemented (REQ-034, REQ-036).
const DashboardPage = ({ token, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { setTasks(d.tasks || []); setLoading(false); });
  }, [token]);

  const byStatus = (s) => tasks.filter((t) => t.status === s);
  const dueToday = tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString());
  const overdue  = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done' && t.status !== 'cancelled');

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Good morning, {user?.name?.split(' ')[0]}</h1>
      <div className="stats-row">
        <div className="stat-card"><span className="stat-number">{byStatus('todo').length}</span><span className="stat-label">To Do</span></div>
        <div className="stat-card accent-blue"><span className="stat-number">{byStatus('in-progress').length}</span><span className="stat-label">In Progress</span></div>
        <div className="stat-card accent-purple"><span className="stat-number">{byStatus('in-review').length}</span><span className="stat-label">In Review</span></div>
        <div className="stat-card accent-green"><span className="stat-number">{byStatus('done').length}</span><span className="stat-label">Done</span></div>
        <div className="stat-card accent-red"><span className="stat-number">{overdue.length}</span><span className="stat-label">Overdue</span></div>
      </div>
      <div className="dashboard-sections">
        <section className="dashboard-section">
          <h2 className="section-title">Due Today ({dueToday.length})</h2>
          {dueToday.length === 0 ? <p className="empty-text">Nothing due today</p> : dueToday.map((t) => <TaskCard key={t._id} task={t} />)}
        </section>
        <section className="dashboard-section">
          <h2 className="section-title">Overdue ({overdue.length})</h2>
          {overdue.length === 0 ? <p className="empty-text">No overdue tasks</p> : overdue.map((t) => <TaskCard key={t._id} task={t} showOverdueBadge />)}
        </section>
      </div>
      <p className="report-coming-soon">Velocity report and CSV export coming in v1.1 (REQ-034, REQ-036)</p>
    </div>
  );
};

export default DashboardPage;
