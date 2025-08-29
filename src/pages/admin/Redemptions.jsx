import CrudPage from "./CrudPage";

const fieldDefs = [
  { name: "userId", label: "User ID", type: "number", required: true },
  { name: "rewardId", label: "Reward ID", type: "number", required: true },
  {
    name: "status",
    label: "Status",
    type: "text",
    required: true,
    placeholder: "pending, completed, failed",
  },
  { name: "catalogItemId", label: "Catalog Item ID", type: "number" },
  { name: "createdAt", label: "Created At", type: "date" },
  { name: "expiryDate", label: "Expiry Date", type: "date" },
  { name: "redeemedAt", label: "Redeemed At", type: "date" },
  { name: "fulfillmentDetails", label: "Fulfillment Details", type: "text" },
  { name: "failureReason", label: "Failure Reason", type: "text" },
  { name: "redemptionCode", label: "Redemption Code", type: "text" },
];

export default function Redemptions() {
  return (
    <CrudPage
      title="Redemption"
      path="/redemptions"
      idKey="redemptionId"
      fieldDefs={fieldDefs}
    />
  );
}
