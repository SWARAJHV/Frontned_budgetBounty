import CrudPage from "./CrudPage";

const fieldDefs = [
  {
    name: "name",
    label: "Partner Name",
    type: "text",
    required: true,
    placeholder: "Partner company name",
  },
  {
    name: "apiKey",
    label: "API Key",
    type: "text",
    placeholder: "Leave empty for auto-generation",
  },
];

export default function Partners() {
  return (
    <CrudPage
      title="Partner"
      path="/partners"
      idKey="partnerId"
      fieldDefs={fieldDefs}

    />
  );
}
