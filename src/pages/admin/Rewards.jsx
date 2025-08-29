// src/pages/Rewards.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/client";
const normalize = (d) =>
  Array.isArray(d)
    ? d
    : Array.isArray(d?.content)
      ? d.content
      : Array.isArray(d?.items)
        ? d.items
        : d && typeof d === "object"
          ? Object.values(d)
          : [];
const num = (v) => (v === "" || v == null ? null : Number(v));

const empty = {
  userId: "",
  points: "",
  goalId: "",
  activityId: "",
  catalogItemId: "",
  earnedAt: "",
};

export default function Rewards() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const r = await api.get("/rewards");
      setRows(normalize(r.data));
    } catch (e) {
      setRows([]);
      setMsg(e?.response?.data?.message || e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const oneOf = (g, a) => {
    const G = g !== "" && g != null;
    const A = a !== "" && a != null;
    return (G || A) && !(G && A);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.userId) {
      setMsg("userId is required");
      return;
    }
    if (!oneOf(form.goalId, form.activityId)) {
      setMsg("Exactly one of goalId or activityId must be provided.");
      return;
    }
    try {
      const body = {
        userId: Number(form.userId),
        points: num(form.points),
        goalId: num(form.goalId),
        activityId: num(form.activityId),
        catalogItemId: num(form.catalogItemId),
        earnedAt: String(form.earnedAt || "").trim(),
      };
      if (editing != null) {
        await api.put(`/rewards/${editing}`, body);
        setMsg("Updated ✔");
      } else {
        await api.post("/rewards", body);
        setMsg("Created ✔");
      }
      setForm(empty);
      setEditing(null);
      await load();
    } catch (err) {
      setMsg(err?.response?.data?.message || err.message || "Save failed");
    }
  };

  const edit = (r) => {
    setEditing(r.rewardId);
    setForm({
      userId: r.userId ?? "",
      points: r.points ?? "",
      goalId: r.goalId ?? "",
      activityId: r.activityId ?? "",
      catalogItemId: r.catalogItemId ?? "",
      earnedAt: r.earnedAt ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const del = async (id) => {
    if (!confirm("Delete reward " + id + "?")) return;
    try {
      await api.delete(`/rewards/${id}`);
      setMsg("Deleted ✔");
      load();
    } catch {
      setMsg("Delete failed");
    }
  };

  const columns = useMemo(() => {
    const s = new Set([
      "rewardId",
      "earnedAt",
      "points",
      "activityId",
      "catalogItemId",
      "goalId",
      "userId",
    ]);
    rows.forEach((r) => Object.keys(r || {}).forEach((k) => s.add(k)));
    return Array.from(s);
  }, [rows]);

  return (
    <div>
      <h2>Rewards</h2>
      <div style={{ marginBottom: 8, color: "#888" }}>
        Exactly one of goalId or activityId must be provided.
      </div>
      {msg && <div style={{ margin: "8px 0" }}>{msg}</div>}
      <form
        onSubmit={submit}
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          marginBottom: 16,
        }}
      >
        {editing != null && (
          <div style={{ alignSelf: "end", opacity: 0.7 }}>
            Editing rewardId: {editing}
          </div>
        )}
        <label>
          <div>User ID *</div>
          <input
            type="number"
            value={form.userId}
            onChange={(e) => onChange("userId", e.target.value)}
            required
          />
        </label>
        <label>
          <div>Points</div>
          <input
            type="number"
            value={form.points}
            onChange={(e) => onChange("points", e.target.value)}
          />
        </label>
        <label>
          <div>goalId</div>
          <input
            type="number"
            value={form.goalId}
            onChange={(e) => onChange("goalId", e.target.value)}
            placeholder="Provide goalId OR activityId"
          />
        </label>
        <label>
          <div>activityId</div>
          <input
            type="number"
            value={form.activityId}
            onChange={(e) => onChange("activityId", e.target.value)}
            placeholder="Provide activityId OR goalId"
          />
        </label>
        <label>
          <div>catalogItemId</div>
          <input
            type="number"
            value={form.catalogItemId}
            onChange={(e) => onChange("catalogItemId", e.target.value)}
          />
        </label>
        <label>
          <div>earnedAt</div>
          <input
            type="text"
            value={form.earnedAt}
            onChange={(e) => onChange("earnedAt", e.target.value)}
            placeholder="YYYY-MM-DDTHH:MM:SS.mmm"
          />
        </label>
        <div style={{ alignSelf: "end" }}>
          <button type="submit">{editing != null ? "Update" : "Create"}</button>{" "}
          {editing != null && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      {loading && <div>Loading…</div>}
      {!loading && !rows.length && <div>No data</div>}
      {!!rows.length && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((k) => (
                  <th
                    key={k}
                    style={{
                      textAlign: "left",
                      borderBottom: "1px solid #444",
                      padding: 8,
                    }}
                  >
                    {k}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rewardId}>
                  {columns.map((k) => (
                    <td
                      key={k}
                      style={{ borderBottom: "1px solid #333", padding: 8 }}
                    >
                      {String(r[k] ?? "")}
                    </td>
                  ))}
                  <td style={{ borderBottom: "1px solid #333", padding: 8 }}>
                    <button onClick={() => edit(r)} style={{ marginRight: 8 }}>
                      Edit
                    </button>
                    <button
                      onClick={() => del(r.rewardId)}
                      style={{ background: "#b00020" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
