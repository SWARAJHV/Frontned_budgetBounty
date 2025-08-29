import React, { useState, useEffect } from "react";
import api from "../../api/client";
import { normalize } from "../../utils/data";

const StatCard = ({ title, value, change, changeType, icon: IconComponent }) => (
  <div className="stats-card">
    <div className="stats-header">
      <div className="stats-info">
        <div className="stats-label">{title}</div>
        <div className="stats-value">{value.toLocaleString()}</div>
      </div>
      <div className="stats-icon">
        <IconComponent />
      </div>
    </div>
    <div className="stats-footer">
      <span className={`status-badge ${changeType === 'positive' ? 'status-success' : 'status-error'}`}>
        {change}
      </span>
      <span className="stats-period">from last month</span>
    </div>
  </div>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="stat-icon">
    <path d="M16 7c0-2.21-1.79-4-4-4S8 4.79 8 7s1.79 4 4 4 4-1.79 4-4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const RewardsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="stat-icon">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const ActivitiesIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="stat-icon">
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
  </svg>
);

const RedemptionsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="stat-icon">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRewards: 0,
    totalActivities: 0,
    totalRedemptions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [users, rewards, activities, redemptions] = await Promise.all([
          api.get("/users").catch(() => ({ data: [] })),
          api.get("/rewards").catch(() => ({ data: [] })),
          api.get("/activities").catch(() => ({ data: [] })),
          api.get("/redemptions").catch(() => ({ data: [] }))
        ]);

        setStats({
          totalUsers: normalize(users.data).length,
          totalRewards: normalize(rewards.data).length,
          totalActivities: normalize(activities.data).length,
          totalRedemptions: normalize(redemptions.data).length
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      change: "+12%",
      changeType: "positive",
      icon: UsersIcon
    },
    {
      title: "Active Rewards",
      value: stats.totalRewards,
      change: "+8%",
      changeType: "positive",
      icon: RewardsIcon
    },
    {
      title: "User Activities",
      value: stats.totalActivities,
      change: "+24%",
      changeType: "positive",
      icon: ActivitiesIcon
    },
    {
      title: "Redemptions",
      value: stats.totalRedemptions,
      change: "+5%",
      changeType: "positive",
      icon: RedemptionsIcon
    }
  ];

  if (loading) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: "center", padding: "4rem" }}>
          <div className="loading-spinner" style={{ margin: "0 auto 1rem" }}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Monitor and manage your rewards system performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ marginTop: "3rem" }}>
        <div className="card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="action-grid">
              <a href="/users" className="action-card">
                <div className="action-icon">
                  <UsersIcon />
                </div>
                <div className="action-content">
                  <div className="action-title">Manage Users</div>
                  <div className="action-description">Add, edit, or remove user accounts</div>
                </div>
              </a>
              
              <a href="/catalog" className="action-card">
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="stat-icon">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div className="action-content">
                  <div className="action-title">Update Catalog</div>
                  <div className="action-description">Manage reward catalog items</div>
                </div>
              </a>
              
              <a href="/redemptions" className="action-card">
                <div className="action-icon">
                  <RedemptionsIcon />
                </div>
                <div className="action-content">
                  <div className="action-title">Process Redemptions</div>
                  <div className="action-description">Review and approve redemption requests</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>System Status</h2>
          </div>
          <div className="card-body">
            <div className="status-grid">
              <div className="status-item">
                <div className="status-indicator">
                  <div className="status-dot status-online"></div>
                  <span>API Status</span>
                </div>
                <span className="status-badge status-success">Online</span>
              </div>
              
              <div className="status-item">
                <div className="status-indicator">
                  <div className="status-dot status-online"></div>
                  <span>Database</span>
                </div>
                <span className="status-badge status-success">Connected</span>
              </div>
              
              <div className="status-item">
                <div className="status-indicator">
                  <div className="status-dot status-online"></div>
                  <span>Cache System</span>
                </div>
                <span className="status-badge status-success">Active</span>
              </div>
              
              <div className="status-item">
                <div className="status-indicator">
                  <div className="status-dot status-neutral"></div>
                  <span>Last Backup</span>
                </div>
                <span className="backup-time">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
