import React from 'react';

// Project grid card with color stripe, member avatars, and archive badge
const ProjectCard = ({ project, onClick }) => {
  const memberCount = project.members?.length || 0;
  return (
    <div className="project-card" onClick={onClick} style={{ borderTop: `4px solid ${project.color}` }}>
      <h3 className="project-card__name">{project.name}</h3>
      {project.description && <p className="project-card__desc">{project.description}</p>}
      <div className="project-card__footer">
        <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
        {project.isArchived && <span className="archived-badge">ARCHIVED</span>}
      </div>
      <div className="project-card__avatars">
        {(project.members || []).slice(0, 4).map((m, i) => (
          <span key={i} className="member-avatar" style={{ background: m.userId?.avatarColor || '#4f46e5' }}>
            {(m.userId?.name || '?')[0].toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;
