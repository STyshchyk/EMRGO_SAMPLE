import "../../initializeYupLocale";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { ReduxRouter } from "@lagunovsky/redux-react-router";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { PersistGate } from "redux-persist/integration/react";

import appConfig from "../appConfig";
import AccessDeniedDialog from "../components/AccessDeniedDialog";
import AppProviders from "../components/AppProviders";
import AppRoutes from "../components/AppRoutes";
import SessionTimeoutDialog from "../components/SessionTimeoutDialog";
import routes from "../constants/routes";
import * as authActionCreators from "../redux/actionCreators/auth";
import history from "../redux/configs/history";
import configureStore from "../redux/configureStore";
import * as wethaqAPIService from "../services/wethaqAPIService";
import { baseAxiosInstance } from "../services/wethaqAPIService/helpers";
import useIsProduction from "../utils/useIsProduction";

import "./app.styles.css";

const { store, persistor } = configureStore();

const region = appConfig.appRegion;

const refreshAuthLogic = async () => {
  try {
    // const tokenRefreshResponse = await wethaqAPIService.authAPI.refreshToken();
    // console.debug('DEBUG refreshAuthLogic tokenRefreshResponse: ', JSON.stringify(tokenRefreshResponse, null, 2));

    await wethaqAPIService.authAPI.refreshToken();

    return Promise.resolve();
  } catch (error) {
    store.dispatch(authActionCreators.doSessionTimeoutDialog(true));
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(baseAxiosInstance, refreshAuthLogic, {
  shouldRefresh: (error) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inProd = useIsProduction(); // !DEV NOTE: THIS IS NOT A REACT HOOK, IT IS A PLAIN FUNCTION

    // !SKIP REFRESHING TOKEN WHEN IN STAGING/PRODUCTION ENV - TEMPORARY BECAUSE THE PROD VERSION OF API DOES NOT SUPPORT REFRESH TOKEN YET
    if (inProd) {
      return false;
    }

    const {
      auth: { isAuthenticated },
    } = store.getState();

    return isAuthenticated && error?.response?.status === 401;
  },
});

baseAxiosInstance.interceptors.request.use((config) => {
  const i18nextLng = localStorage.getItem("i18nextLng")
    ? localStorage.getItem("i18nextLng").split("-")[0].toUpperCase()
    : "EN";
  const updatedConfig = config;
  updatedConfig.headers.locale = `${i18nextLng}`;
  updatedConfig.headers.region = `${region}`;
  return updatedConfig;
});

baseAxiosInstance.interceptors.response.use(undefined, (error) => {
  const {
    auth: { isAuthenticated },
  } = store.getState();

  const errorMessage = error.message;
  const axiosErrorResponse = error.response;
  // const originalAxiosRequestConfig = error.config;

  // console.debug('DEBUG error');

  // !Dev note: Forcefully logout the user if Wethaq API service is down
  // TODO: Maybe the user should be redirected GENTLY to a Service Not Available page instead?
  if (isAuthenticated && errorMessage === "Network Error") {
    store.dispatch(authActionCreators.doLogoutUser());
  }

  if (axiosErrorResponse) {
    // if (isAuthenticated && axiosErrorResponse?.status === 401) {
    //   // Check if this error is not thrown as a result of incomplete MFA step
    //   if (!axiosErrorResponse?.data?.messageCode) {
    //     console.debug('DEBUG MFA? messageCode: ', axiosErrorResponse?.data?.messageCode); // !DEV NOTE: NOT TESTED
    //
    //     store.dispatch(authActionCreators.doSessionTimeoutDialog(true));
    //   }
    // }

    if (axiosErrorResponse?.status === 403) {
      // navigate(`${routes.dashboard.home}`);

      store.dispatch(authActionCreators.doAccessDeniedDialog(true));
    }
  }

  return Promise.reject(error);
});

const ReduxProvider = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ReduxRouter history={history}>{children}</ReduxRouter>
    </PersistGate>
  </Provider>
);

export const App = () => (
  <>
    <AppRoutes />
    <ToastContainer
      autoClose={3000}
      className="toast-container"
      closeOnClick
      draggable={false}
      hideProgressBar
      newestOnTop
      pauseOnHover
      pauseOnVisibilityChange
      position="bottom-center"
      rtl={false}
    />
    <SessionTimeoutDialog />
    <AccessDeniedDialog />
  </>
);

const ConnectedApp = () => (
  <ReduxProvider>
    <AppProviders>
      <App />
    </AppProviders>
  </ReduxProvider>
);

export default ConnectedApp;
