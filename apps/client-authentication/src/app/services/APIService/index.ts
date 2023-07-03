import { BASE_API_URL } from "@emrgo-frontend/constants";
import axios from "axios";

export const authApi = axios.create({
  baseURL: BASE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";
