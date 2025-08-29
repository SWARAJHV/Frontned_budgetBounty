import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import user components
import Navbar from '../../components/user/Navbar';

// Import user pages
import Dashboard from '../../pages/user/Dashboard';
import PartnersPage from '../../pages/user/PartnersPage';
import CategoryDetailPage from '../../pages/user/CategoryDetailPage';
import TransactionsPage from '../../pages/user/TransactionsPage';
import RedeemPage from '../../pages/user/RedeemPage';
import ProfilePage from '../../pages/user/ProfilePage';
import RewardsPage from '../../pages/user/RewardsPage';
import HomePage from '../../pages/user/HomePage';

// Import ONLY user CSS
import './UserApp.css';
import './UserTheme.css';

export default function UserApp({ user, onLogout }) {
  return (
    <div className="user-app">
      <Navbar currentUser={user} onLogout={onLogout} />
      <div className="user-content">
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/partners/:categoryId" element={<CategoryDetailPage />} />
          <Route path="/transactions" element={<TransactionsPage user={user} />} />
          <Route path="/redeem" element={<RedeemPage user={user}/>} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
