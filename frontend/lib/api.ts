import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.method === "post") {
    const key = uuidv4();
    config.headers["x-idempotency-key"] = key;
  }
  return config;
});

export default api;
