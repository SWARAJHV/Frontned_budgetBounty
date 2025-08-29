import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/client';
import { normalize } from '../../utils/data';
import './RedeemPage.css';

const SUCCESS_SPEND_STATUSES = new Set(['SUCCESS']);

export default function RedeemPage({ user }) {
  // catalog UI
  const [catalog, setCatalog] = useState([]);
  const [partners, setPartners] = useState([]);

  // history for balance + chips
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);

  // derived balance
  const [currentPoints, setCurrentPoints] = useState(0);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [posting, setPosting] = useState(false);

  // ---------- helpers ----------
  const computeBalance = (rwds, reds) => {
    const earned = rwds.reduce((s, r) => s + (Number(r.points) || 0), 0);
    const spent = reds
      .filter(r => SUCCESS_SPEND_STATUSES.has(String(r.status || '').toUpperCase()))
      .reduce((s, r) => s + (Number(r.pointsSpent) || 0), 0);
    return Math.max(0, earned - spent);
  };

  const loadPointsData = async (userId) => {
    const [rewardsRes, redemptionsRes] = await Promise.all([
      api.get(`/rewards/user/${userId}`).catch(() => ({ data: [] })),
      api.get(`/redemptions/user/${userId}`).catch(() => ({ data: [] })),
    ]);
    const rwds = normalize(rewardsRes.data);
    const reds = normalize(redemptionsRes.data);
    setRewards(rwds);
    setRedemptions(reds);
    setCurrentPoints(computeBalance(rwds, reds));
  };

  // Initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        if (!user?.id) return;

        // 1) points-related data first
        await loadPointsData(user.id);

        // 2) catalog + partners (for cards)
        const [catalogRes, partnersRes] = await Promise.all([
          api.get('/reward-catalog').catch(() => ({ data: [] })),
          api.get('/partners').catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;
        setCatalog(normalize(catalogRes.data));
        setPartners(normalize(partnersRes.data));
      } catch (e) {
        if (mounted) setError('Failed to load data: ' + (e?.message || ''));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  // partner name map
  const partnerMap = useMemo(() => {
    const map = new Map();
    partners.forEach(p => map.set(p.partnerId ?? p.id, p.name));
    return map;
  }, [partners]);

  // chips
  const totalEarned = rewards.reduce((s, r) => s + (Number(r.points) || 0), 0);
  const totalSpent = redemptions
    .filter(r => SUCCESS_SPEND_STATUSES.has((r.status || '').toUpperCase()))
    .reduce((s, r) => s + (Number(r.pointsSpent) || 0), 0);

  const BalanceCard = () => (
    <div className="redeem-hero">
      <div className="balance-card fancy subtle">
        <div className="balance-label">Your Current Balance</div>
        <div className="balance-amount">
          <span className="amount">{currentPoints.toLocaleString()}</span>
          <span className="unit">pts</span>
        </div>
        <div className="mini-stats">
          <span className="chip positive">+ {totalEarned.toLocaleString()} earned</span>
          <span className="chip negative">− {totalSpent.toLocaleString()} spent</span>
        </div>
      </div>
    </div>
  );

  const handleSelectReward = (reward) => {
    const today = new Date().toISOString().split('T')[0];
    const expiryDate = reward.expiryDate || '2026-12-31';
    const isExpired = expiryDate < today;
    const points = Number(reward.pointsRequired ?? reward.points ?? 0);
    const canAfford = currentPoints >= points;
    const isActive = Number(reward.active ?? 1) === 1;
    if (!isExpired && canAfford && isActive) {
      setSelectedReward({
        id: reward.catalogItemId ?? reward.id,
        title: reward.name,
        points,
        brand: partnerMap.get(reward.partnerId ?? reward.partner_id) || 'Unknown',
        catalogItemId: reward.catalogItemId ?? reward.id
      });
    }
  };

  const handleGoBack = () => setSelectedReward(null);

  const handleConfirmRedemption = async () => {
    if (!selectedReward || !user?.id) return;
    setPosting(true);
    try {
      await api.post('/redemptions', {
        userId: user.id,
        catalogItemId: selectedReward.catalogItemId
      });
      // Recompute balance from fresh history
      await loadPointsData(user.id);
      alert(`Successfully redeemed ${selectedReward.title}!`);
      setSelectedReward(null);
    } catch (e) {
      setError(e?.response?.data?.message || 'Redemption failed');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="redeem-page"><p>Loading rewards...</p></div>;

  // ------------ Confirmation view ------------
  if (selectedReward) {
    const remaining = currentPoints - selectedReward.points;
    return (
      <div className="redeem-page">
        <BalanceCard />
        <div className="redeem-container">
          <div className="redeem-summary">
            <h3>{selectedReward.title}</h3>
            <p>Brand: <strong>{selectedReward.brand}</strong></p>
          </div>

          <div className="points-calculation">
            <div className="balance-row">
              <span>Current Points</span>
              <span>{currentPoints.toLocaleString()}</span>
            </div>
            <div className="balance-row cost">
              <span>Cost</span>
              <span>-{selectedReward.points.toLocaleString()}</span>
            </div>
            <div className="balance-row total">
              <span>Remaining Points</span>
              <span>{remaining.toLocaleString()}</span>
            </div>
          </div>

          <button className="btn confirm-btn" onClick={handleConfirmRedemption} disabled={posting}>
            {posting ? 'Processing…' : 'Confirm Redemption'}
          </button>
          <button className="back-btn" onClick={handleGoBack} disabled={posting}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ------------ Catalog view ------------
  return (
    <div className="redeem-page">
      <BalanceCard />
      <h2>Redeem Your Points</h2>
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

          let cardClass = 'reward-card';
          let tagClass = 'card-tag';
          let tagText = 'VALID';
          if (isExpired || !isActive) {
            cardClass += ' expired';
            tagClass += ' expired';
            tagText = 'EXPIRED';
          } else if (!canAfford) {
            cardClass += ' disabled';
            tagClass += ' disabled';
            tagText = 'INSUFFICIENT';
          } else {
            tagClass += ' valid';
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
                {isExpired || !isActive ? 'Expired' : 'Redeem'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
