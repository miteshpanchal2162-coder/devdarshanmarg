import axios from "axios";
import { env } from "@/config/env";

/** Shared Axios instance — wire interceptors in Step 2 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl || undefined,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});
