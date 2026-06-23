import React, { useEffect, useState } from 'react';

// Add comment implemented. Edit and Delete are NOT implemented — buttons are disabled stubs (REQ-023, REQ-024).
// @mention in textarea is UI only — no notification triggered (REQ-025 not implemented).
const CommentList = ({ taskId, token }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = () =>
    fetch(`/api/tasks/${taskId}/comments`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setComments(d.comments || []));

  useEffect(() => { loadComments(); }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    await fetch(`/api/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment }),
    });
    setNewComment('');
    setSubmitting(false);
    loadComments();
  };

  return (
    <div className="comment-list">
      <h3 className="comment-list__title">Comments ({comments.length})</h3>
      {comments.length === 0 && <p className="empty-text">No comments yet.</p>}
      {comments.map((c) => (
        <div key={c._id} className="comment-item">
          <div className="comment-header">
            <span className="comment-avatar" style={{ background: c.author?.avatarColor }}>{c.author?.name?.[0]?.toUpperCase()}</span>
            <span className="comment-author">{c.author?.name}</span>
            <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span>
            {c.isEdited && <span className="comment-edited">(edited)</span>}
          </div>
          <p className="comment-content">{c.content}</p>
          <div className="comment-actions">
            <button className="btn-text" disabled title="Edit coming in v1.1 (REQ-023)">Edit</button>
            <button className="btn-text btn-text--danger" disabled title="Delete coming in v1.1 (REQ-024)">Delete</button>
          </div>
        </div>
      ))}
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea className="comment-input" placeholder="Add a comment... (@mentions coming in v1.1)" value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} />
        <button className="btn-primary" type="submit" disabled={submitting || !newComment.trim()}>
          {submitting ? 'Posting...' : 'Post comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentList;
