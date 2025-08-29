import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const validate = (role) => {
    // REMOVE password validation since you don't use it
    if (!username) return 'Please enter username/email';
    if (role === 'user' && !email) return 'Please enter email to continue';
    return '';
  };

  const login = (role) => {
    const v = validate(role);
    if (v) { setErr(v); return; }
    setErr('');
    if (role === 'user') {
      onLogin('user', { email: email.trim(), username: username.trim() });
    } else {
      onLogin('admin', { username: username.trim() }); // username field contains email for admin
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <div className="login-brand"><h2>Rewards System</h2></div>
        <p className="intro-text">Please sign in to access your account</p>
        {err && <div className="error-message">{err}</div>}

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label htmlFor="email">Email (User only)</label>
            <input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com"/>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username/Email (For Admin login)</label>
            <input id="username" type="text" value={username}
              onChange={(e) => setUsername(e.target.value)} placeholder="Enter your email"/>
          </div>

          {/* REMOVE or COMMENT OUT the password field since you don't use it */}
          {/* <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>
          </div> */}

          <div className="login-buttons">
            <button type="button" className="btn admin-btn" onClick={() => login('admin')}>Login as Admin</button>
            <button type="button" className="btn" onClick={() => login('user')}>Login as User</button>
          </div>
        </form>
      </div>
    </div>
  );
}