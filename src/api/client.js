import axios from "axios";

const baseURL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  timeout: 20000,
});

// helpful logs in dev
api.interceptors.request.use((cfg) => {
  console.log(
    "[API] →",
    cfg.method?.toUpperCase(),
    baseURL + (cfg.url || ""),
    cfg.params || cfg.data || "",
  );
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.error("[API] ←", err.response.status, err.response.data);
    } else {
      console.error("[API] Network/Timeout:", err.message);
    }
    return Promise.reject(err);
  },
);

export default api;
