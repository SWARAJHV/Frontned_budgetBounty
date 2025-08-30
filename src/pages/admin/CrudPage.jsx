import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
import { normalize, toBool } from "../../utils/data";

export default function CrudPage({
  title,
  path,
  idKey = "id",
  fieldDefs = [],
  listFields = null, // NEW: Add listFields prop
}) {
  const empty = useMemo(() => {
    const e = {};
    for (const f of fieldDefs) e[f.name] = "";
    return e;
  }, [fieldDefs]);

  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // NEW: filters + sorting
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(idKey);
  const [sortDir, setSortDir] = useState("desc"); // newest first

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.get(path);
      setRows(normalize(res.data));
    } catch (e) {
      setRows([]);
      setMsg(e?.response?.data?.message || e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(empty);
    setEditing(null);
    load();
  }, [path, empty]);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const toNumberOrNull = (v) => (v === "" ? null : Number(v));

  const coerceTypes = (body) => {
    const out = {};
    for (const f of fieldDefs) {
      const v = body[f.name];
      if (f.type === "number") out[f.name] = toNumberOrNull(v);
      else if (f.type === "boolean") out[f.name] = toBool(v);
      else if (f.type === "date" && v) {
        out[f.name] = v + "T00:00:00";
      } else out[f.name] = typeof v === "string" ? v.trim() : v;
    }
    return out;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errors = [];
    for (const f of fieldDefs) {
      if (f.required && (!form[f.name] || form[f.name] === "")) {
        errors.push(`${f.label} is required`);
      }
    }
    if (errors.length > 0) {
      setMsg(errors.join(", "));
      return;
    }

    try {
      const body = coerceTypes(form);
      if (editing != null) {
        await api.put(`${path}/${editing}`, body);
        setMsg("Record updated successfully");
      } else {
        await api.post(path, body);
        setMsg("Record created successfully");
      }
      setForm(empty);
      setEditing(null);
      await load();
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message || "Operation failed");
    }
  };

  const edit = (r) => {
    setEditing(r[idKey]);
    const f = {};
    for (const d of fieldDefs) f[d.name] = r[d.name] ?? "";
    setForm(f);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (id) => {
    if (!confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) return;
    try {
      await api.delete(`${path}/${id}`);
      setMsg("Record deleted successfully");
      load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Delete failed");
    }
  };

  // MODIFIED: Filter keys based on listFields prop
  const allKeys = useMemo(() => {
    const base = new Set(fieldDefs.map((f) => f.name));
    rows.forEach((r) => Object.keys(r || {}).forEach((k) => base.add(k)));
    
    let arr = Array.from(base);
    
    // NEW: Filter keys if listFields is provided
    if (listFields && Array.isArray(listFields) && listFields.length > 0) {
      arr = arr.filter(key => listFields.includes(key));
    }
    
    arr.sort((a, b) => (a === idKey ? -1 : b === idKey ? 1 : a.localeCompare(b)));
    return arr;
  }, [rows, fieldDefs, idKey, listFields]); // NEW: Added listFields dependency

  // NEW: filtered + sorted rows
  const filteredRows = useMemo(() => {
    let out = [...rows];
    // apply filters
    for (const [k, v] of Object.entries(filters)) {
      if (v !== "" && v != null) {
        out = out.filter((r) =>
          String(r[k] ?? "").toLowerCase().includes(String(v).toLowerCase())
        );
      }
    }
    // apply sorting
    out.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return out;
  }, [rows, filters, sortKey, sortDir]);

  // Render input (used for both form + filters)
  const renderFieldInput = (field, value, onChangeFn, isFilter = false) => {
    switch (field.type) {
      case "boolean":
        return (
          <select value={value} onChange={(e) => onChangeFn(e.target.value)}>
            <option value="">{isFilter ? "All" : "Select..."}</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      case "select":
        return (
          <select value={value} onChange={(e) => onChangeFn(e.target.value)}>
            <option value="">{isFilter ? "All" : "Select..."}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            placeholder={isFilter ? `Filter by ${field.label}` : ""}
            onChange={(e) => onChangeFn(e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            placeholder={isFilter ? `Filter by ${field.label}` : ""}
            onChange={(e) => onChangeFn(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="main-body">
      <div className="page-header">
        <h1 className="page-title">{title} Management</h1>
        <p className="page-subtitle">
          Create, edit, and manage {title.toLowerCase()} records
        </p>
      </div>

      {/* FIRST: Add New */}
      <div className="card">
        <div className="card-header">
          <h2>{editing ? `Edit ${title}` : `Add New ${title}`}</h2>
        </div>
        <div className="card-body">
          {msg && (
            <div
              className={`alert ${
                msg.includes("successfully") ? "alert-success" : "alert-error"
              }`}
            >
              {msg.includes("successfully") ? "✓" : "⚠"} {msg}
            </div>
          )}

          <form onSubmit={submit} className="form-grid">
            {fieldDefs.map((field) => (
              <div key={field.name} className="form-field">
                <label>
                  {field.label}
                  {field.required && <span className="required-indicator">*</span>}
                </label>
                {renderFieldInput(field, form[field.name], (v) =>
                  onChange(field.name, v)
                )}
              </div>
            ))}

            <div className="actions">
              <button type="submit" className="btn btn-primary">
                {editing ? "Update Record" : "Create Record"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setForm(empty);
                    setMsg("");
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* SECOND: Records */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <div className="card-header">
          <h2>
            {title} Records ({filteredRows.length})
          </h2>
        </div>
        <div className="card-body">
          {/* Filter Bar */}
          <div className="filter-bar">
            {fieldDefs.map((field) => (
              <div key={field.name} className="filter-field">
                <label>{field.label}</label>
                {renderFieldInput(
                  field,
                  filters[field.name] ?? "",
                  (v) => setFilters((s) => ({ ...s, [field.name]: v })),
                  true
                )}
              </div>
            ))}
            <button
              className="btn btn-secondary"
              style={{ alignSelf: "end", marginTop: "1.5rem" }}
              onClick={() => setFilters({})}
            >
              Clear Filters
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div className="loading-spinner" style={{ margin: "0 auto 1rem" }}></div>
              <p>Loading records...</p>
            </div>
          ) : !filteredRows.length ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No {title.toLowerCase()} records found</h3>
              <p>Create your first {title.toLowerCase()} record using the form above.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {allKeys.map((k) => (
                      <th
                        key={k}
                        onClick={() => {
                          if (sortKey === k) {
                            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                          } else {
                            setSortKey(k);
                            setSortDir("asc");
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {k
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        {sortKey === k ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                      </th>
                    ))}
                    <th style={{ width: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((r) => (
                    <tr key={r[idKey]}>
                      {allKeys.map((k) => (
                        <td key={k}>
                          {typeof r[k] === "boolean" ? (
                            <span
                              className={`status-badge ${
                                r[k] ? "status-success" : "status-error"
                              }`}
                            >
                              {r[k] ? "Yes" : "No"}
                            </span>
                          ) : (
                            String(r[k] ?? "")
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="actions">
                          <button
                            onClick={() => edit(r)}
                            className="btn btn-secondary btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => del(r[idKey])}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}