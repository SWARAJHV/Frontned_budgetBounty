import React from 'react';
import { Link } from 'react-router-dom'; // Make sure Link is imported
import './PartnersPage.css';

const partnerCategories = [
  { 
    id: 'food',
    title: 'Food & Drink', 
    description: 'Satisfy your cravings and get rewarded with every order.',
  },
  { 
    id: 'retail',
    title: 'Retail Therapy', 
    description: 'Turn your wishlist into reality with points from top brands.',
  },
  { 
    id: 'entertainment',
    title: 'Entertainment', 
    description: 'Use your points for experiences you will never forget.',
  },
  { 
    id: 'travel',
    title: 'Travel & Adventure', 
    description: 'Your next getaway is closer than you think. Fly, stay, and explore.',
  }
];

function PartnersPage() {
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
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            {/* This button is now a Link that navigates to the detail page */}
            <Link to={`/partners/${category.id}`} className="btn">Explore</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersPage;