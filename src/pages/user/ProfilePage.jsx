import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../api/client';
import { normalize } from '../../utils/data';
import './ProfilePage.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
 
export default function ProfilePage({ user }) {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [monthlyData, setMonthlyData] = useState({
    labels: ['March', 'April', 'May', 'June', 'July', 'August'],
    pointsEarned: [1200, 1800, 900, 2500, 1500, 3000],
  });
  const [hasRealData, setHasRealData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        // Get current user points - ALWAYS fetch fresh points
        if (user?.id) {
          const userRes = await api.get('/users', { params: { id: user.id } });
          const userList = normalize(userRes.data);
          if (mounted && userList.length > 0) {
            const points = Number(userList[0].points) || 0;
            setCurrentPoints(points);
            console.log('Fetched user points:', points); // Debug log
          }
        }

        // Get rewards data to build chart
        if (user?.id) {
          const rewardsRes = await api.get('/rewards', { params: { userId: user.id } });
          const rewardsList = normalize(rewardsRes.data);
          
          console.log('Fetched rewards:', rewardsList); // Debug log
          
          if (mounted && rewardsList.length > 0) {
            // Group rewards by month
            const monthlyPoints = {};
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
            
            rewardsList.forEach(reward => {
              const earnedDate = new Date(reward.earnedAt || reward.earned_at);
              if (!isNaN(earnedDate.getTime())) {
                const monthName = monthNames[earnedDate.getMonth()];
                monthlyPoints[monthName] = (monthlyPoints[monthName] || 0) + Number(reward.points || 0);
              }
            });
            
            // Use real data if we have it
            const realDataKeys = Object.keys(monthlyPoints);
            if (realDataKeys.length > 0) {
              const labels = realDataKeys;
              const pointsEarned = labels.map(month => monthlyPoints[month]);
              setMonthlyData({ labels, pointsEarned });
              setHasRealData(true);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load profile data:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    loadData();
    return () => { mounted = false; };
  }, [user?.id]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Points Earned' },
    },
    scales: { y: { beginAtZero: true } }
  };

  const chartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Points Earned',
        data: monthlyData.pointsEarned,
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="profile-page">
      <h1>Profile - {user?.name || user?.email || 'User'}</h1>
      
      <div className="points-summary">
        <div className="points-label">Your Current Balance</div>
        <div className="points-total">
          {loading ? 'Loading...' : currentPoints.toLocaleString()} pts
        </div>
      </div>

      <div className="chart-container">
        {loading ? (
          <p>Loading chart data...</p>
        ) : hasRealData ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No rewards data available yet.</p>
            <p>Chart will appear once you earn some points!</p>
          </div>
        )}
      </div>
    </div>
  );
}
 
