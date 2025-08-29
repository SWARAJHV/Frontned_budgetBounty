import React from 'react';
import './HomePage.css'; // Create a matching CSS file for custom purple styling

function HomePage() {
  return (
    <div className="home-container">
      <div className="main-section">
        <h2 className="title">
          <span>Earn <span className="highlight">Rewards</span> with NatWest</span>
        </h2>
        <div className="app-badges">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" 
            alt="Download on App Store" 
            className="badge"
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
            alt="Get it on Google Play" 
            className="badge"
          />
        </div>
        <div className="illustration">
          {/* Replace with a proper SVG/image matching screenshot style */}
          <img 
            src="https://www.natwest.com/content/dam/natwest/myrewards/reward-account.png" 
            alt="Reward Account Illustration" 
            className="reward-img"
          />
        </div>
        <button className="access-btn" onClick={() => window.location.assign('/login')}>
          Access MyRewards
        </button>
      </div>
      <footer>
        <button className="chat-btn">Chat to Cora</button>
      </footer>
    </div>
  );
}

export default HomePage;
