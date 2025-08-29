import React, { useEffect, useState } from "react";
import api from "../../api/client";

const statusColors = {
  SUCCESS: "text-green-600",
  FAILED: "text-red-600",
  REFUNDED: "text-blue-600",
  PENDING: "text-orange-500",
  EXPIRED: "text-gray-500",
};

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

  const truncate = (str, len = 40) => str?.length > len ? str.slice(0, len) + "…" : str;

  // Helper function to determine points display for redemptions
  const getRedemptionPointsDisplay = (redemption) => {
    const points = redemption.pointsSpent || 0;
    
    if (redemption.status === "FAILED" || redemption.status === "REFUNDED") {
      return {
        points: `+${points} pts`,
        className: "text-green-700 font-semibold"
      };
    } else {
      return {
        points: `-${points} pts`,
        className: "text-red-700 font-semibold"
      };
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Your Transactions</h2>

      {/* Rewards Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🎉 Rewards Earned</h3>
        {rewards.length === 0 ? (
          <p className="text-gray-500">No rewards earned yet.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Source</th>
                <th className="p-2 text-left">Points</th>
                <th className="p-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((r) => (
                <tr key={r.rewardId} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-2" title={r.description}>{truncate(r.description)}</td>
                  <td className="p-2 text-green-700 font-semibold">+{r.points} pts</td>
                  <td className="p-2">{r.earnedAt ? new Date(r.earnedAt).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Redemptions Table */}
      <div>
        <h3 className="text-xl font-semibold mb-2">💳 Redemptions</h3>
        {redemptions.length === 0 ? (
          <p className="text-gray-500">No redemptions yet.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">Points</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Code</th>
              </tr>
            </thead>
            <tbody>
              {redemptions.map((r) => {
                const pointsDisplay = getRedemptionPointsDisplay(r);
                
                return (
                  <tr key={r.redemptionId} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-2" title={r.catalogItemName || `Catalog Item #${r.catalogItemId}`}>
                      {truncate(r.catalogItemName || `Catalog Item #${r.catalogItemId}`)}
                    </td>
                    <td className={`p-2 ${pointsDisplay.className}`}>
                      {pointsDisplay.points}
                    </td>
                    <td className={`p-2 font-semibold ${statusColors[r.status]}`}>{r.status}</td>
                    <td className="p-2">{r.redeemedAt ? new Date(r.redeemedAt).toLocaleString() : "—"}</td>
                    <td className="p-2">{r.redemptionCode || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}