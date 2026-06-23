import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

// ProjectsPage — grid of projects, create project modal.
// Archive project is NOT implemented — delete button returns 501 (REQ-012).
const ProjectsPage = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#4f46e5' });
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => { setProjects(d.projects || []); setLoading(false); });

  useEffect(() => { load(); }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowCreate(false);
    setForm({ name: '', description: '', color: '#4f46e5' });
    load();
  };

  if (loading) return <div className="loading-spinner">Loading projects...</div>;

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>+ New Project</button>
      </div>
      {projects.length === 0
        ? <div className="empty-state"><p>No projects yet. Create your first one.</p></div>
        : <div className="projects-grid">{projects.map((p) => <ProjectCard key={p._id} project={p} />)}</div>}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">New Project</h2>
            <form onSubmit={handleCreate}>
              <input className="modal-input" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <textarea className="modal-input" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <div className="color-row"><label>Color:</label><input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
