import { useEffect, useState } from "react";
import api from "../api/client";

// Accepts { id, email, name, points } and returns live user + reload
export default function useLiveUser(initialUser) {
  const [user, setUser] = useState({
    id: initialUser?.id ?? null,
    email: initialUser?.email ?? null,
    name: initialUser?.name ?? initialUser?.email ?? "",
    points: typeof initialUser?.points === "number" ? Number(initialUser.points) : null,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchUser = async (by) => {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/users", { params: by });
      const data = res?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.content)
        ? data.content
        : (data && typeof data === "object")
        ? Object.values(data)
        : [];
      const u = list.length ? list : null;
      if (u) {
        setUser((s) => ({
          id: (u.userId ?? u.user_id) ?? s.id,
          email: s.email,
          name: s.name,
          points: typeof u.points === "number" ? Number(u.points) : s.points,
        }));
      }
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Resolve by id first, else by email, on mount and when id/email change
  useEffect(() => {
    if (user.id) fetchUser({ id: user.id });
    else if (user.email) fetchUser({ email: user.email });
  }, [user.id, user.email]);

  // Manual refresh (after redemption)
  const refresh = async () => {
    if (user.id) await fetchUser({ id: user.id });
    else if (user.email) await fetchUser({ email: user.email });
  };

  return { user, setUser, loading, err, refresh };
}
