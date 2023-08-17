import { BASE_API_URL, clientAuthenticationRoutes } from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";
import axios from "axios";
import store from "store";

export const dashboardApi = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

dashboardApi.defaults.headers.common["Content-Type"] = "application/json";

const hydratedUser = store.get("user");

// Add an Axios interceptor to handle token refresh
dashboardApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Make a request to the token refresh endpoint
      try {
        await dashboardApi({
          method: "post",
          url: "/auth/v2/refreshTokens",
          data: { role: hydratedUser?.role },
        });

        // Retry the original request with the updated token
        return dashboardApi(originalRequest);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError: any) {
        // Handle refresh token request error
        console.error("Error refreshing access token:", refreshError);
        // Redirect to login or show an error message
        if (
          refreshError.response.status === 403 ||
          refreshError.response.status === 500 ||
          refreshError.response.status === 502
        ) {
          navigateModule("authentication", clientAuthenticationRoutes.home);
        }
      }
    }

    return Promise.reject(error);
  }
);
