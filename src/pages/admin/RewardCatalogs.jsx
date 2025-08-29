import CrudPage from "./CrudPage";

const fieldDefs = [
  {
    name: "name",
    label: "Item Name",
    type: "text",
    required: true,
    placeholder: "Reward item name",
  },
  { name: "active", label: "Active", type: "boolean", required: true },
  {
    name: "pointsRequired",
    label: "Points Required",
    type: "number",
    required: true,
  },
  {
    name: "rewardType",
    label: "Reward Type",
    type: "text",
    required: true,
    placeholder: "e.g., discount, gift",
  },
  {
    name: "validityDuration",
    label: "Validity Duration (days)",
    type: "number",
  },
  { name: "partnerId", label: "Partner ID", type: "number" },
];

export default function RewardCatalogs() {
  return (
    <CrudPage
      title="Catalog Item"
      path="/reward-catalog"
      idKey="catalogItemId"
      fieldDefs={fieldDefs}
    />
  );
}
