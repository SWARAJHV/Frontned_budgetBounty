import CrudPage from "./CrudPage";

const fieldDefs = [
  { name: "email", label: "Email", type: "text", required: true, placeholder: "user@example.com" },
  { name: "appAdmin", label: "App Admin", type: "boolean", required: true },
  { name: "points", label: "Points", type: "number", required: true, placeholder: "0" },
];

export default function Users() {
  return <CrudPage title="User" path="/users" idKey="userId" fieldDefs={fieldDefs} />;
}
