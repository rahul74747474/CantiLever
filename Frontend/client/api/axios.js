import axios from "axios";

const instance = axios.create({
  baseURL:  "https://cantilever-uj6q.onrender.com",
  // baseURL:  "https://40z329b0-3000.inc1.devtunnels.ms/api/v1",
});

// Auto-add token to headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;

