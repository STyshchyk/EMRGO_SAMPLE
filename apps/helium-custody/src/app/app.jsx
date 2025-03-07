import "../../initializeYupLocale";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistGate } from "redux-persist/integration/react";

import appConfig from "../appConfig";
import AccessDeniedDialog from "../components/AccessDeniedDialog";
import AppProviders from "../components/AppProviders";
import AppRoutes from "../components/AppRoutes";
import SessionTimeoutDialog from "../components/SessionTimeoutDialog";
import history from "../redux/configs/history";
import configureStore from "../redux/configureStore";
import { baseAxiosInstance } from "../services/wethaqAPIService/helpers";

import "./app.styles.css";

const { store, persistor } = configureStore();

const region = appConfig.appRegion;

baseAxiosInstance.interceptors.request.use((config) => {
  const i18nextLng = localStorage.getItem("i18nextLng")
    ? localStorage.getItem("i18nextLng").split("-")[0].toUpperCase()
    : "EN";
  const updatedConfig = config;
  updatedConfig.headers.locale = `${i18nextLng}`;
  updatedConfig.headers.region = `${region}`;
  return updatedConfig;
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 3,
      staleTime: 5 * 1000,
    },
  },
});
const ConnectedApp = () => (
  <ReduxProvider>
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </AppProviders>
    </QueryClientProvider>
  </ReduxProvider>
);

export default ConnectedApp;
