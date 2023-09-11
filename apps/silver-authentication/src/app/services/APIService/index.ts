import { BASE_API_URL as BASE_URL } from "@emrgo-frontend/constants";
import axios from "axios";

const BASE_API_URL = BASE_URL;
export const authApi = axios.create({
  baseURL: `${BASE_API_URL}`,
  headers: { "Content-Type": "application/json" },
  //Skip running auth refresh for this instance
  withCredentials: true,
  validateStatus: function (status) {
    return status < 300;
  },
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

// dashboardApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//
//       // Make a request to the token refresh endpoint
//       try {
//         await dashboardApi({
//           method: "post",
//           url: "/auth/v2/refreshTokens"
//         });
//
//         // Retry the original request with the updated token
//         return dashboardApi(originalRequest);
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (refreshError: any) {
//         // Handle refresh token request error
//         console.error("Error refreshing access token:", refreshError);
//         // Navigate to login or show an error message
//         if (
//           refreshError.response.status === 403 ||
//           refreshError.response.status === 500 ||
//           refreshError.response.status === 502
//         ) {
//           // useUserStore.getState().removeUser();
//         }
//       }
//     }
//
//     return Promise.reject(error);
//   }
// );
