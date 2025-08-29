// src/pages/Rewards.jsx
import CrudPage from "./CrudPage";

const fieldDefs = [
  { name: "userId", label: "User ID", type: "number", required: true },
  { name: "rewardId", label: "Reward ID", type: "number", required: false },
  { name: "points", label: "Points", type: "number", required: true },
  { name: "goalId", label: "Goal ID", type: "number", required: false },
  { name: "activityId", label: "Activity ID", type: "number", required: false },
  { name: "catalogItemId", label: "Catalog Item ID", type: "number", required: false },
  { name: "earnedAt", label: "Earned At", type: "date", required: false },
];

export default function Rewards() {
  return (
    <CrudPage
      title="Reward"
      path="/rewards"
      idKey="rewardId"
      fieldDefs={fieldDefs}
      defaultSort={{ key: "earnedAt", direction: "desc" }}
    />
  );
}
