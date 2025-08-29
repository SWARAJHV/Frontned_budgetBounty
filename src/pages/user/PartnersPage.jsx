import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PartnersPage.css';

// Real brand logos as SVG components
const BrandLogos = {
  // Food & Drink
  'McDonalds': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <path fill="#FFC72C" d="M21.53 7.15c0 5.02-4.17 9.09-9.32 9.09S2.89 12.17 2.89 7.15C2.89 2.13 7.06-1.94 12.21-1.94s9.32 4.07 9.32 9.09z"/>
      <path fill="#DA020E" d="M14.87 4.29c-1.35 0-2.68.54-3.66 1.52-.98-.98-2.31-1.52-3.66-1.52-2.87 0-5.19 2.32-5.19 5.19s2.32 5.19 5.19 5.19c1.35 0 2.68-.54 3.66-1.52.98.98 2.31 1.52 3.66 1.52 2.87 0 5.19-2.32 5.19-5.19s-2.32-5.19-5.19-5.19z"/>
    </svg>
  ),
  'Starbucks': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <circle cx="12" cy="12" r="12" fill="#00704A"/>
      <path fill="#FFF" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm4.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  ),
  'PizzaHut': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <circle cx="12" cy="12" r="12" fill="#E31837"/>
      <path fill="#FFF" d="M6 8h12l-1 8H7l-1-8zm6 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  ),
  // Retail
  'Amazon': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.29-.12.138-.061.234-.1.29-.12.138-.061.234-.1.29-.12l.348.348-8.735-2.417c-.043-.011-.08-.024-.11-.04-.072-.116-.168-.108-.29.022l8.154 2.417c.043.011.08.024.11.04.072.116.168.108.29-.022l-8.447 1.595c-.138.061-.234.1-.29.12-.138.061-.234.1-.29.12-.138.061-.234.1-.29.12l-.315.14c-2.779 1.062-5.595 1.595-8.447 1.595-4.276 0-8.234-1.056-11.87-3.166-.161-.102-.276-.094-.348.022z"/>
      <path fill="#000" d="M18.325 12.287c.014.138.027.297.041.478.014.158.027.306.041.444.041.423.096.802.164 1.139.068.336.15.651.246.944.096.293.205.565.328.816.123.252.26.482.41.69.15.209.314.397.492.565.178.168.37.316.574.444.205.129.424.238.657.328.233.09.48.162.74.217.26.054.535.081.825.081s.565-.027.825-.081c.26-.055.507-.127.74-.217.233-.09.452-.199.657-.328.204-.128.396-.276.574-.444.178-.168.342-.356.492-.565.15-.208.287-.438.41-.69.123-.251.232-.523.328-.816.096-.293.178-.608.246-.944.068-.337.123-.716.164-1.139.014-.138.027-.286.041-.444.014-.181.027-.34.041-.478"/>
    </svg>
  ),
  'Netflix': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <path fill="#E50914" d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm0 0v24c2.566-.002 5.148-.198 5.851-.222-2.996-8.233-5.611-15.19-8.851-23.778z"/>
    </svg>
  ),
  'Spotify': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <circle cx="12" cy="12" r="12" fill="#1DB954"/>
      <path fill="#FFF" d="M16.884 17.06c-.273.435-.88.54-1.314.273-2.38-1.453-5.36-1.78-8.91-.98-.54.122-1.07-.213-1.19-.753-.122-.54.212-1.07.752-1.19 3.89-.88 7.22-.513 9.87 1.13.434.273.54.88.273 1.314zm1.13-2.58c-.338.54-1.07.72-1.61.38-2.67-1.63-6.73-2.1-9.92-1.15-.63.19-1.29-.19-1.47-.82-.19-.63.19-1.29.82-1.47 3.63-1.05 8.12-.52 11.21 1.34.54.34.72 1.07.38 1.61z"/>
    </svg>
  ),
  // Additional categories
  'Steam': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <circle cx="12" cy="12" r="12" fill="#1b2838"/>
      <path fill="#FFF" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm5-8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
  ),
  'Uber': () => (
    <svg viewBox="0 0 24 24" className="brand-logo">
      <circle cx="12" cy="12" r="12" fill="#000"/>
      <path fill="#FFF" d="M8.6 6.5v1.7h2.5V6.5H8.6zm0 3.2v5.5h2.5v-5.5H8.6zm4.2-3.2v1.7h2.5V6.5h-2.5zm0 3.2v5.5h2.5v-5.5h-2.5z"/>
    </svg>
  )
};

const partnerCategories = [
  { 
    id: 'food',
    title: 'Food & Drink', 
    description: 'Satisfy your cravings and get rewarded with every order.',
    partners: [
      { name: "McDonald's", component: BrandLogos.McDonalds },
      { name: 'Starbucks', component: BrandLogos.Starbucks },
      { name: 'Pizza Hut', component: BrandLogos.PizzaHut },
      { name: 'Subway', icon: '🥪' },
      { name: 'KFC', icon: '🍗' },
      { name: 'Dominos', icon: '🍕' },
    ]
  },
  { 
    id: 'retail',
    title: 'Retail Therapy', 
    description: 'Turn your wishlist into reality with points from top brands.',
    partners: [
      { name: 'Amazon', component: BrandLogos.Amazon },
      { name: 'Target', icon: '🎯' },
      { name: 'Best Buy', icon: '💻' },
      { name: 'Nike', icon: '👟' },
      { name: 'Apple', icon: '🍎' },
      { name: 'Walmart', icon: '🛒' },
    ]
  },
  { 
    id: 'entertainment',
    title: 'Entertainment', 
    description: 'Use your points for experiences you will never forget.',
    partners: [
      { name: 'Netflix', component: BrandLogos.Netflix },
      { name: 'Spotify', component: BrandLogos.Spotify },
      { name: 'Disney+', icon: '🏰' },
      { name: 'AMC', icon: '🍿' },
      { name: 'Xbox', icon: '🎮' },
      { name: 'PlayStation', icon: '🎯' },
    ]
  },
  { 
    id: 'travel',
    title: 'Travel & Adventure', 
    description: 'Your next getaway is closer than you think. Fly, stay, and explore.',
    partners: [
      { name: 'Airbnb', icon: '🏡' },
      { name: 'Uber', component: BrandLogos.Uber },
      { name: 'Delta', icon: '✈️' },
      { name: 'Hilton', icon: '🏨' },
      { name: 'Expedia', icon: '🧳' },
      { name: 'Booking.com', icon: '🌍' },
    ]
  }
];

function PartnersPage() {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (categoryId) => {
    setExpandedCard(expandedCard === categoryId ? null : categoryId);
  };

  return (
    <div className="partners-page">
      <div className="partners-header">
        <h1>Our Partners</h1>
        <p className="intro-text">
          Explore exclusive offers and earn more rewards by browsing our partner categories.
        </p>
      </div>

      <div className="card-container">
        {partnerCategories.map(category => (
          <div key={category.id} className="card">
            <div className="card-main-content">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              
              <div className="card-actions">
                <Link to={`/partners/${category.id}`} className="btn btn-primary">
                  Explore Offers
                </Link>
                <button 
                  className="btn btn-secondary"
                  onClick={() => toggleCard(category.id)}
                  aria-expanded={expandedCard === category.id}
                >
                  {expandedCard === category.id ? 'Hide Partners' : 'View Partners'}
                </button>
              </div>
            </div>

            <div className={`partner-logo-container ${expandedCard === category.id ? 'expanded' : ''}`}>
              <div className="logo-scroller">
                {category.partners.map((partner, index) => (
                  <div key={index} className="mini-logo" title={partner.name}>
                    {partner.component ? (
                      <partner.component />
                    ) : (
                      <span className="partner-icon">{partner.icon}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="partners-footer">
        <div className="stats-section">
          <h2>Join Thousands of Happy Users</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">800+</span>
              <span className="stat-label">Partner Brands</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">75K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">$5M+</span>
              <span className="stat-label">Rewards Earned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnersPage;