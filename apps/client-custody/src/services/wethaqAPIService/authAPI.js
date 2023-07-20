import { baseAxiosInstance } from "./helpers";

const authenticateUser = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: "/v1/auth/login",
    data: payload.requestPayload,
    skipAuthRefresh: true,
  });

const fetchCurrentUserData = () =>
  baseAxiosInstance({
    method: "GET",
    url: "/v1/auth/current",
  });

const getAuthenticatedUserData = () =>
  baseAxiosInstance({
    method: "GET",
    url: "/v1/auth/current",
  });

const invitePlatformUser = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/v1/auth/registerAdmin`,
  });

const logoutUser = () =>
  baseAxiosInstance({
    method: "GET",
    url: "/v1/auth/logout",
    skipAuthRefresh: true,
  });

const requestPasswordResetLink = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: "/v1/auth/forgot",
    data: payload,
  });

const requestPasswordReset = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/auth/recover/${payload.token}`,
    data: payload,
  });

const registerEntityUser = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/v1/auth/registerUser`,
  });

const requestMFAReset = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/auth/recoverMFA/${payload.token}`,
    data: payload,
  });

const requestPasswordAndMFAReset = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/auth/recoverMFAAndPassword/${payload.token}`,
    data: payload,
  });

const requestMFAPath = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/auth/MFAUrl`,
  });

const setupMFA = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/auth/setMFA/${payload.otp}`,
    skipAuthRefresh: true,
  });

const refreshToken = () =>
  baseAxiosInstance({
    method: "POST",
    url: "/v1/auth/refreshToken",
    data: {},
    skipAuthRefresh: true,
  });

const authAPI = {
  registerEntityUser,
  invitePlatformUser,
  requestPasswordReset,
  requestPasswordResetLink,
  logoutUser,
  authenticateUser,
  getAuthenticatedUserData,
  fetchCurrentUserData,
  requestMFAReset,
  requestPasswordAndMFAReset,
  requestMFAPath,
  setupMFA,
  refreshToken,
};

export default authAPI;
