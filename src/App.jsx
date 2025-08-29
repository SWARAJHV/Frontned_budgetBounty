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
    try {
      const adminEmail = payload.username;
      
      // Use the existing search endpoint with email parameter
      const userResponse = await api.get('/users/search', { params: { email: adminEmail } });
      const adminUser = userResponse.data;
      
      console.log('Admin user data:', adminUser); // Check what's returned
      
      if (!adminUser) {
        alert('Admin user not found: ' + adminEmail);
        return;
      }
      
      // Check the appAdmin field directly from the search response
      if (!adminUser.appAdmin) {
        alert('Access denied: You are not an administrator');
        return;
      }
      
      // Only set as admin if verified
      setCurrentUser({ 
        role: 'admin', 
        name: adminUser.email,
        id: adminUser.userId,
        email: adminUser.email
      });
      
    } catch (error) {
      alert('Admin login failed: ' + (error.response?.data?.message || 'User not found or not an admin'));
    }
    return;
  }

  // User login code (uses the same search endpoint)
  const { email, username } = payload || {};
  try {
    const res = await api.get('/users/search', { params: { email } });
    const u = res.data;
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