import React, { useState } from 'react';

// LoginPage — email/password login. Token stored in memory via useAuth (not localStorage).
// Password reset is NOT implemented — link redirects to /reset which returns 501 (REQ-004).
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">TF</div>
        <h1 className="login-title">Welcome to TaskFlow</h1>
        <p className="login-subtitle">Sign in to your workspace</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input className="login-input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input className="login-input" type={showPwd ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="toggle-pwd" onClick={() => setShowPwd(!showPwd)}>{showPwd ? 'Hide' : 'Show'}</button>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="forgot-link">Forgot password? <a href="/reset">Reset here</a> (not yet implemented — v1.1)</p>
      </div>
    </div>
  );
};

export default LoginPage;
