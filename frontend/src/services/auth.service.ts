import { apiClient, unwrapApiData } from "@/services/api-client";
import type { AuthUser } from "@/stores/auth-store";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type SendOtpPayload = {
  identifier: string;
  purpose?: string;
};

export type VerifyOtpPayload = {
  identifier: string;
  otp: string;
  purpose?: string;
};

export type ResetPasswordPayload = {
  verificationToken: string;
  password: string;
};

export const authService = {
  async login(payload: LoginPayload) {
    const response = await apiClient.post("/auth/login", payload);
    return unwrapApiData<AuthTokens>(response.data);
  },

  async refresh(refreshToken: string) {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return unwrapApiData<{ accessToken: string; refreshToken: string }>(response.data);
  },

  async logout(refreshToken: string) {
    const response = await apiClient.post("/auth/logout", { refreshToken });
    return unwrapApiData<unknown>(response.data);
  },

  async me() {
    const response = await apiClient.get("/auth/me");
    return unwrapApiData<AuthUser>(response.data);
  },

  async sendOtp(payload: SendOtpPayload) {
    const response = await apiClient.post("/auth/send-otp", payload);
    return unwrapApiData<unknown>(response.data);
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    const response = await apiClient.post("/auth/verify-otp", payload);
    return unwrapApiData<unknown>(response.data);
  },

  async forgotPassword(payload: SendOtpPayload) {
    const response = await apiClient.post("/auth/forgot-password", payload);
    return unwrapApiData<unknown>(response.data);
  },

  async resetPassword(payload: ResetPasswordPayload) {
    const response = await apiClient.post("/auth/reset-password", payload);
    return unwrapApiData<unknown>(response.data);
  },
};
