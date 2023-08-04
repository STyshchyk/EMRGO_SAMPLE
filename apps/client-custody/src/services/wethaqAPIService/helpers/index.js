import axios from "axios";
import store from "store";

import appConfig from "../../../appConfig";
import { clientAuthenticationRoutes } from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";


const axiosParams = {
  baseURL: appConfig.baseAPIURL,
  // baseURL: "https://d0dfd200c7c4.ngrok.io/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
};

// eslint-disable-next-line import/prefer-default-export
export const baseAxiosInstance = axios.create(axiosParams);

const hydratedUser = store.get("user");

// Add an Axios interceptor to handle token refresh
baseAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Make a request to the token refresh endpoint
      try {
        await baseAxiosInstance({
          method: "post",
          url: "v2/refreshTokens",
          data: { role: hydratedUser?.role },
        });
        // Retry the original request with the updated token
        return baseAxiosInstance(originalRequest);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (refreshError) {
        // Handle refresh token request error
        console.error("Error refreshing access token:", refreshError);
        // Navigate to login or show an error message
        if (
          refreshError.response.status === 403 ||
          refreshError.response.status === 500 ||
          refreshError.response.status === 502
        ) {
          console.log("redirect to client-auth login");
          navigateModule("authentication", clientAuthenticationRoutes.home);
        }
      }
    }

    return Promise.reject(error);
  }
);
