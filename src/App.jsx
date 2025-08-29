import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminApp from './apps/admin/AdminApp';
import UserApp from './apps/user/UserApp';
import LoginPage from './LoginPage';
import './index.css';
import api from './api/client';

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && typeof data === 'object') return Object.values(data);
  return [];
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = async (role, payload) => {
    if (role === 'admin') {
      setCurrentUser({ role: 'admin', name: payload.username });
      return;
    }

    const { email, username } = payload || {};

    try {
      const res = await api.get('/users/search', { params: { email } });
const u = res.data; // backend returns a single UserDTO now
if (!u) {
  alert('No user found for email: ' + email);
  return;
}

setCurrentUser({
  role: 'user',
  email,
  name: username || email,
  id: u.userId ?? u.user_id,
  points: Number(u.points) || 0
});

    } catch (e) {
      alert('Failed to resolve user: ' + (e?.response?.data?.message || e.message));
    }
  };

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) return <LoginPage onLogin={handleLogin} />;

  return (
    <Router>
      {currentUser.role === 'admin' ? (
        <AdminApp user={currentUser} onLogout={handleLogout} />
      ) : (
        <UserApp user={currentUser} onLogout={handleLogout} />
      )}
    </Router>
  );
}

export default App;
