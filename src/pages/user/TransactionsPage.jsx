// TransactionsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/client";

export default function TransactionsPage({ user }) {
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardsRes, redemptionsRes] = await Promise.all([
          api.get(`/rewards/user/${user.id}`),
          api.get(`/redemptions/user/${user.id}`),
        ]);
        setRewards(Array.isArray(rewardsRes.data) ? rewardsRes.data : rewardsRes.data.content || []);
        setRedemptions(Array.isArray(redemptionsRes.data) ? redemptionsRes.data : redemptionsRes.data.content || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchData();
  }, [user.id]);

  const truncate = (s, n = 48) => (s?.length > n ? s.slice(0, n) + "…" : s);

  const redemptionPointsChip = (r) => {
    const pts = r.pointsSpent || 0;
    if (r.status === "FAILED" || r.status === "REFUNDED") {
      return { text: `+${pts} pts`, cls: "chip chip--green" };
    }
    return { text: `-${pts} pts`, cls: "chip chip--red" };
  };

  const statusClass = (s) =>
    ({
      SUCCESS: "chip chip--success",
      FAILED: "chip chip--failed",
      REFUNDED: "chip chip--refunded",
      PENDING: "chip chip--pending",
      EXPIRED: "chip chip--expired",
    }[s] || "chip");

  return (
    <div className="transactions-page">
      <div className="tp-header">
        <h2>Your Transactions</h2>
        <p>Track rewards earned and redemption history.</p>
      </div>

      {/* Rewards */}
      <section className="tp-card">
        <div className="tp-card__head">
          <span className="tp-emoji">🎉</span>
          <h3>Rewards Earned</h3>
        </div>

        {rewards.length === 0 ? (
          <div className="tp-empty">No rewards earned yet.</div>
        ) : (
          <div className="tp-table-wrap">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Points</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => (
                  <tr key={r.rewardId}>
                    <td title={r.description}>
                      <span className="cell-title">{truncate(r.description)}</span>
                    </td>
                    <td>
                      <span className="chip chip--green">+{r.points} pts</span>
                    </td>
                    <td className="muted">{r.earnedAt ? new Date(r.earnedAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Redemptions */}
      <section className="tp-card">
        <div className="tp-card__head">
          <span className="tp-emoji">💳</span>
          <h3>Redemptions</h3>
        </div>

        {redemptions.length === 0 ? (
          <div className="tp-empty">No redemptions yet.</div>
        ) : (
          <div className="tp-table-wrap">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Points</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Code</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((r) => {
                  const chip = redemptionPointsChip(r);
                  return (
                    <tr key={r.redemptionId}>
                      <td title={r.catalogItemName || `Catalog Item #${r.catalogItemId}`}>
                        <span className="cell-title">
                          {truncate(r.catalogItemName || `Catalog Item #${r.catalogItemId}`)}
                        </span>
                      </td>
                      <td><span className={chip.cls}>{chip.text}</span></td>
                      <td><span className={statusClass(r.status)}>{r.status}</span></td>
                      <td className="muted">{r.redeemedAt ? new Date(r.redeemedAt).toLocaleString() : "—"}</td>
                      <td className="code">{r.redemptionCode || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
