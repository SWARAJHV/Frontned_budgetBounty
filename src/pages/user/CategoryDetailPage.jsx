import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPartnerIcon } from './partner-icons.jsx';
import './CategoryDetailPage.css';

// We need the full data here to find the correct category
const partnerDataByCategory = {
  food: {
    title: "Food & Drink",
    description: "Satisfy your cravings and get rewarded with every order.",
    partners: [
      { id: 'f1', name: 'Starbucks' }, { id: 'f2', name: 'Third Wave Coffee' },
      { id: 'f3', name: 'Taco Bell' }, { id: 'f4', name: 'McDonald\'s' },
      { id: 'f5', name: 'Zomato' }, { id: 'f6', name: 'Swiggy' },
    ]
  },
  retail: {
    title: "Retail Therapy",
    description: "Shop from your favorite brands and turn your wishlist into reality.",
    partners: [
      { id: 'r1', name: 'Amazon' }, { id: 'r2', name: 'Flipkart' },
      { id: 'r3', name: 'Myntra' }, { id: 'r4', name: 'Nykaa' },
      { id: 'r5', name: 'Croma' }, { id: 'r6', name: 'Decathlon' },
    ]
  },
  entertainment: {
    title: "Entertainment",
    description: "Use your points for experiences you'll never forget.",
    partners: [
      { id: 'e1', name: 'BookMyShow' }, { id: 'e2', name: 'PVR Cinemas' },
      { id: 'e3', name: 'Spotify' }, { id: 'e4', name: 'Netflix' },
      { id: 'e5', name: 'Prime Video' },
    ]
  },
  travel: {
    title: "Travel & Adventure",
    description: "Your next getaway is closer than you think. Fly, stay, and explore.",
    partners: [
      { id: 't1', name: 'MakeMyTrip' }, { id: 't2', name: 'Goibibo' },
      { id: 't3', name: 'British Airways' }, { id: 't4', name: 'Marriott Bonvoy' },
      { id: 't5', name: 'Uber' },
    ]
  }
};

function CategoryDetailPage() {
  // useParams hook from React Router gets the ':categoryId' from the URL
  const { categoryId } = useParams();
  const categoryData = partnerDataByCategory[categoryId];

  if (!categoryData) {
    return <h2>Category not found!</h2>;
  }

  return (
    <div className="category-detail-page">
      <Link to="/partners" className="back-link">← Back to All Partners</Link>
      <div className="category-detail-header">
        <h1>{categoryData.title}</h1>
        <p className="intro-text">{categoryData.description}</p>
      </div>
      <div className="brand-grid">
        {categoryData.partners.map(partner => (
          <div key={partner.id} className="brand-card">
            <div className="brand-icon-container">
              {getPartnerIcon(partner.name) || <span className="brand-initial">{partner.name.charAt(0)}</span>}
            </div>
            <span className="brand-name">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryDetailPage;