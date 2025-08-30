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
import api from '../../api/client';

export default function AdminApp({ user, onLogout }) {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!user || !user.id) {
        navigate('/');
        return;
      }

      try {
        const response = await api.get(`/users/check-admin/${user.id}`);
        if (!response.data) {
          alert('Access denied: Administrator privileges required');
          onLogout();
          return;
        }
        setIsVerified(true);
      } catch (error) {
        console.error('Admin verification failed:', error);
        alert('Failed to verify admin access');
        onLogout();
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAccess();
  }, [user, navigate, onLogout]);

  if (loading) {
    return <div className="admin-app">Verifying admin access...</div>;
  }

  if (!isVerified) {
    return <div className="admin-app">Access denied. Redirecting...</div>;
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
