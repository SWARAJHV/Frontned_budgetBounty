import CrudPage from "./CrudPage";

const goalTypeOptions = [
  { value: "GROCERY", label: "Grocery" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "INSURANCE", label: "Insurance" },
];

const fieldDefs = [
  { name: "userId", label: "User ID", type: "number", required: true },
  {
    name: "goalType",
    label: "Goal Type",
    type: "select",
    required: true,
    options: goalTypeOptions,
    placeholder: "Select goal type",
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
    <CrudPage
      title="Goal"
      path="/goals"
      idKey="goalId"
      fieldDefs={fieldDefs}
    />
  );
}
