import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL || "/api").trim();

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});
