import React from 'react';
import './RewardsPage.css';

// Data representing rewards the user has claimed and currently holds.
const myRewardsData = [
  { id: 2, title: 'Starbucks Voucher', points: 1500, brand: 'Starbucks' },
  { id: 1, title: 'Amazon Gift Card', points: 5000, brand: 'Amazon' },
  { id: 4, title: 'Movie Ticket', points: 2500, brand: 'Cinema' },
];

function RewardsPage() {
  return (
    <div className="rewards-page">
      <h2>My Rewards</h2>
      <p className="intro-text">Here are the rewards you've claimed and have available to use.</p>
      <div className="rewards-grid">
        {myRewardsData.map(reward => (
          <div key={reward.id} className="reward-card">
            <h3>{reward.brand}</h3>
            <p>{reward.title}</p>
            <div className="reward-points">{reward.points.toLocaleString()} pts</div>
            {/* No 'Redeem' button and no 'Claimed On' date, as requested */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RewardsPage;