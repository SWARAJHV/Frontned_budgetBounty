// Data normalization utilities
export const normalize = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (data && typeof data === "object") {
    const vals = Object.values(data);
    if (vals.length && typeof vals[0] === "object") return vals;
  }
  return [];
};

export const truthyTo01 = (v) => {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  if (s === "true" || s === "1" || s === "yes") return 1;
  if (s === "false" || s === "0" || s === "no") return 0;
  return v === true ? 1 : v === false ? 0 : null;
};

export const numOrNull = (v) => (v === "" || v == null ? null : Number(v));

export const isoOrEmpty = (v) => String(v || "").trim();

export const toBool = (v) => {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};
