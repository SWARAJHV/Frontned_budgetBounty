import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Hi, {user?.name || 'Guest'},</h2>
        <p className="intro-text">
          Welcome to the Rewards System Dashboard.
        </p>
      </div>
      
      <div className="card-container">
        <div className="card">
          <span className="card-icon">🤝</span>
          <h3>Our Partners</h3>
          <p>Explore exclusive offers from our partner brands.</p>
          <Link to="/partners" className="btn">Explore</Link>
        </div>
        
        <div className="card">
          <span className="card-icon">📄</span>
          <h3>View Transactions</h3>
          <p>Check detailed reward point transactions.</p>
          <Link to="/transactions" className="btn">Go</Link>
        </div>
        
        <div className="card">
          <span className="card-icon">🎁</span>
          <h3>Redeem Points</h3>
          <p>Redeem your points for gift cards and vouchers.</p>
          <Link to="/redeem" className="btn">Go</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
