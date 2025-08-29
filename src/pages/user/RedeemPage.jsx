import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/client';
import { normalize } from '../../utils/data';
import './RedeemPage.css';

export default function RedeemPage({ user }) {
  const [catalog, setCatalog] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [posting, setPosting] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(0);

  // Load user points and catalog data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('RedeemPage: Fetching data for user:', user?.id); // DEBUG LOG
        
        // Get current user points - ALWAYS fetch fresh
        if (user?.id) {
          const userRes = await api.get('/users', { 
            params: { id: user.id },
            headers: { 'Cache-Control': 'no-cache' } // Prevent caching
          });
          const userList = normalize(userRes.data);
          console.log('User API response:', userList); // DEBUG LOG
          
          if (mounted && userList.length > 0) {
            const points = Number(userList[0].points) || 0;
            console.log('Setting current points to:', points); // DEBUG LOG
            setCurrentPoints(points);
          }
        }
        
        // Get catalog and partners
        const [catalogRes, partnersRes] = await Promise.all([
          api.get('/reward-catalog').catch(() => ({ data: [] })),
          api.get('/partners').catch(() => ({ data: [] }))
        ]);
        
        if (mounted) {
          setCatalog(normalize(catalogRes.data));
          setPartners(normalize(partnersRes.data));
        }
      } catch (e) {
        console.error('RedeemPage error:', e); // DEBUG LOG
        if (mounted) setError('Failed to load rewards: ' + e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchData();
    return () => { mounted = false; };
  }, [user?.id]);

  const partnerMap = useMemo(() => {
    const map = new Map();
    partners.forEach(p => map.set(p.partnerId ?? p.id, p.name));
    return map;
  }, [partners]);

  const handleSelectReward = (reward) => {
    const today = new Date().toISOString().split('T')[0];
    const expiryDate = reward.expiryDate || '2026-12-31';
    const isExpired = expiryDate < today;
    const canAfford = currentPoints >= Number(reward.pointsRequired ?? reward.points ?? 0);
    const isActive = Number(reward.active ?? 1) === 1;
    
    if (!isExpired && canAfford && isActive) {
      setSelectedReward({
        id: reward.catalogItemId ?? reward.id,
        title: reward.name,
        points: Number(reward.pointsRequired ?? reward.points ?? 0),
        brand: partnerMap.get(reward.partnerId ?? reward.partner_id) || 'Unknown',
        catalogItemId: reward.catalogItemId ?? reward.id
      });
    }
  };

  const handleGoBack = () => {
    setSelectedReward(null);
  };

  const handleConfirmRedemption = async () => {
    if (!selectedReward || !user?.id) return;
    
    setPosting(true);
    try {
      console.log('Posting redemption:', { userId: user.id, catalogItemId: selectedReward.catalogItemId }); // DEBUG LOG
      
      await api.post('/redemptions', {
        userId: user.id,
        catalogItemId: selectedReward.catalogItemId
      });
      
      // CRITICAL: Refresh points from server after successful redemption
      const userRes = await api.get('/users', { 
        params: { id: user.id },
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      const userList = normalize(userRes.data);
      console.log('Points after redemption:', userList); // DEBUG LOG
      
      if (userList.length > 0) {
        const newPoints = Number(userList[0].points) || 0;
        setCurrentPoints(newPoints);
        console.log('Updated points to:', newPoints); // DEBUG LOG
      }
      
      alert(`Successfully redeemed ${selectedReward.title}!`);
      setSelectedReward(null);
    } catch (e) {
      console.error('Redemption error:', e); // DEBUG LOG
      setError(e?.response?.data?.message || 'Redemption failed');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="redeem-page"><p>Loading rewards...</p></div>;

  // Show confirmation screen when reward is selected
  if (selectedReward) {
    const remainingPoints = currentPoints - selectedReward.points;
    
    return (
      <div className="redeem-page">
        <div className="redeem-container">
          <div className="redeem-summary">
            <h3>{selectedReward.title}</h3>
            <p>Your current balance is <strong>{currentPoints.toLocaleString()} pts</strong>.</p>
          </div>
          
          <div className="redeem-points-cost">
            -{selectedReward.points.toLocaleString()} pts
          </div>
          
          <div className="points-calculation">
            <div className="balance-row">
              <span>Current Points:</span>
              <span>{currentPoints.toLocaleString()}</span>
            </div>
            <div className="balance-row cost">
              <span>Cost:</span>
              <span>-{selectedReward.points.toLocaleString()}</span>
            </div>
            <div className="balance-row total">
              <span>Remaining Points:</span>
              <span>{remainingPoints.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            className="btn confirm-btn" 
            onClick={handleConfirmRedemption}
            disabled={posting}
          >
            {posting ? 'Processing...' : 'Confirm Redemption'}
          </button>
          <button className="back-btn" onClick={handleGoBack} disabled={posting}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="redeem-page">
      <h2>Redeem Your Points</h2>
      <div className="balance-display">
        Your current balance is <strong>{currentPoints.toLocaleString()} pts</strong>.
      </div>
      
      {error && <div className="alert alert-error">⚠ {error}</div>}
      
      <div className="rewards-grid">
        {catalog.map((reward) => {
          const today = new Date().toISOString().split('T')[0];
          const expiryDate = reward.expiryDate || '2026-12-31';
          const isExpired = expiryDate < today;
          const points = Number(reward.pointsRequired ?? reward.points ?? 0);
          const canAfford = currentPoints >= points;
          const isActive = Number(reward.active ?? 1) === 1;
          const isDisabled = isExpired || !canAfford || !isActive;
          
          let cardClass = "reward-card";
          let tagClass = "card-tag";
          let tagText = "VALID";
          
          if (isExpired || !isActive) {
            cardClass += " expired";
            tagClass += " expired";
            tagText = "EXPIRED";
          } else if (!canAfford) {
            cardClass += " disabled";
            tagClass += " disabled";
            tagText = "INSUFFICIENT";
          } else {
            tagClass += " valid";
          }
          
          return (
            <div 
              key={reward.catalogItemId ?? reward.id}
              className={cardClass}
              onClick={() => !isDisabled && handleSelectReward(reward)}
            >
              <div className={tagClass}>{tagText}</div>
              
              <div className="brand-header">
                <div className="brand-name">
                  {partnerMap.get(reward.partnerId ?? reward.partner_id) || 'Unknown'}
                </div>
              </div>
              
              <h3>{reward.name}</h3>
              
              <div className="reward-points">{points.toLocaleString()} pts</div>
              
              <button 
                className="btn" 
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) handleSelectReward(reward);
                }}
              >
                {isExpired || !isActive ? 'Expired' : !canAfford ? 'Redeem' : 'Redeem'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
