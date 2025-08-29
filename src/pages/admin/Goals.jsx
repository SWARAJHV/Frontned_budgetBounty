import CrudPage from "./CrudPage";

const fieldDefs = [
  { name: "userId", label: "User ID", type: "number", required: true },
  {
    name: "goalType",
    label: "Goal Type",
    type: "text",
    required: true,
    placeholder: "e.g., monthly_login",
  },
  {
    name: "customAttrs",
    label: "Custom Attributes",
    type: "text",
    placeholder: "JSON string",
  },
  { name: "isAchieved", label: "Is Achieved", type: "boolean", required: true },
];

export default function Goals() {
  return (
    <CrudPage title="Goal" path="/goals" idKey="goalId" fieldDefs={fieldDefs} />
  );
}
