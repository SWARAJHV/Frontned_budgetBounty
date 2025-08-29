import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <h1 className="nav-title">Rewards System</h1>
      
      {currentUser ? (
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      ) : (
        <ul className="nav-links">
          <li><Link to="/login">Login</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
