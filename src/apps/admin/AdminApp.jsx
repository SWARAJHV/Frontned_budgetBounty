import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import admin components
import Sidebar from '../../components/admin/Sidebar';
import Dashboard from '../../pages/admin/Dashboard';
import Users from '../../pages/admin/Users';
import Rewards from '../../pages/admin/Rewards';
import Activities from '../../pages/admin/Activities';
import Goals from '../../pages/admin/Goals';
import Partners from '../../pages/admin/Partners';
import RewardCatalogs from '../../pages/admin/RewardCatalogs';
import Redemptions from '../../pages/admin/Redemptions';

// Import ONLY admin CSS
import './AdminApp.css';
import './AdminTheme.css';

export default function AdminApp({ user, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AdminApp mounted with user:', user);
    
    // Simple check - if no user or no user ID, redirect to login
    if (!user || !user.id) {
      console.log('No user found, redirecting to login');
      navigate('/');
      return;
    }
    
    console.log('User verified during login, proceeding to admin panel');
    setLoading(false);
  }, [user, navigate]);

  if (loading) {
    return <div className="admin-app">Loading admin panel...</div>;
  }

  return (
    <div className="admin-app">
      <div className="admin-app-container">
        <Sidebar user={user} onLogout={onLogout} />
        <main className="admin-main-content">
          <div className="admin-content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/catalog" element={<RewardCatalogs />} />
              <Route path="/redemptions" element={<Redemptions />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}