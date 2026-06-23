import { useState, useEffect, useCallback } from 'react';

const useTasks = (token, filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`/api/tasks${params ? '?' + params : ''}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) { setTasks(data.tasks || []); setError(null); }
    else setError(data.error);
    setLoading(false);
  }, [token, JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = useCallback(async (taskId, status) => {
    const res = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
    else { const d = await res.json(); throw new Error(d.error); }
  }, [token, load]);

  return { tasks, loading, error, reload: load, updateStatus };
};

export default useTasks;
