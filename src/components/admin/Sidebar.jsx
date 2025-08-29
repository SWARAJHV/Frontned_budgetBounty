import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const items = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/users", label: "Users", icon: "users" },
  { to: "/rewards", label: "Rewards", icon: "rewards" },
  { to: "/activities", label: "Activities", icon: "activities" },
  { to: "/goals", label: "Goals", icon: "goals" },
  { to: "/partners", label: "Partners", icon: "partners" },
  { to: "/catalog", label: "Reward Catalog", icon: "catalog" },
  { to: "/redemptions", label: "Redemptions", icon: "redemptions" },
];

const IconComponent = ({ type }) => {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    rewards: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    activities: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
    ),
    goals: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    partners: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
      </svg>
    ),
    catalog: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    redemptions: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="icon">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
      </svg>
    ),
  };
  
  return icons[type] || icons.dashboard;
};

export default function Sidebar({ user, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="logo-svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="logo-text">
            <div className="logo-title">RewardsPro</div>
            <div className="logo-subtitle">Admin Console</div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {items.map((item) => (
            <li key={item.to} className="nav-item">
              <NavLink 
                to={item.to} 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <span className="nav-icon">
                  <IconComponent type={item.icon} />
                </span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor" className="avatar-icon">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="user-details">
            <div className="user-name">{user.name}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <button onClick={onLogout} className="btn btn-secondary" style={{marginTop: '1rem', width: '100%'}}>
          Logout
        </button>
      </div>
    </div>
  );
}
