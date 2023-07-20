import { BASE_API_URL, silverAuthenticationRoutes } from "@emrgo-frontend/constants";
import { navigateSilverModule, silverModule } from "@emrgo-frontend/utils";
import axios from "axios";

export const sharedSilverDashboardApi = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

sharedSilverDashboardApi.defaults.headers.common["Content-Type"] = "application/json";

// Add an Axios interceptor to handle token refresh
sharedSilverDashboardApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Make a request to the token refresh endpoint
      try {
        await sharedSilverDashboardApi({
          method: "post",
          url: "v2/refreshTokens",
        });

        // Retry the original request with the updated token
        return sharedSilverDashboardApi(originalRequest);
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
          navigateSilverModule(silverModule.authentication, silverAuthenticationRoutes.home);
        }
      }
    }

    return Promise.reject(error);
  }
);
