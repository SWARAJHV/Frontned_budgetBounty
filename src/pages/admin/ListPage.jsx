import { useEffect, useState } from "react";
import api from "../../api/client";

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (data && typeof data === "object") {
    const vals = Object.values(data);
    if (vals.length && typeof vals[0] === "object") return vals;
  }
  return [];
}

export default function ListPage({ title, path, idKey = "id" }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(path);
      setRows(normalize(res.data));
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [path]);

  return (
    <div className="page-section">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="card">
        <div className="card-body" style={{ paddingTop: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>All {title}</h3>
            <button className="btn" onClick={load}>Refresh</button>
          </div>

          {loading && <p className="muted">Loading…</p>}
          {err && <p style={{ color: "crimson" }}>Error: {err}</p>}
          {!loading && !rows.length && !err && <p className="muted">No data</p>}

          {!!rows.length && (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {Object.keys(rows[0] || {}).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r[idKey] ?? i}>
                      {Object.keys(rows[0]).map((k) => (
                        <td key={k}>{String(r[k] ?? "")}</td>
                      ))}
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
