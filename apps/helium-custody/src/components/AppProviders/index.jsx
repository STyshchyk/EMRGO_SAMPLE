import { Suspense, useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { useDarkModeCustomSilver } from "@emrgo-frontend/services";
import { ToastProvider, UserProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { AuthProvider } from "../../context/auth-context";
import { CustodyWrapperProvider } from "../../context/custody-context";
import { FeatureToggleProvider } from "../../context/feature-toggle-context";
import { CustomThemeProvider } from "../../context/theme-context";
import { UserProvider as CustodyUserProvider } from "../../context/user-context";
import i18n from "../../i18n";

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
const AppProviders = ({ children }) => {
  const { isDarkMode, disable } = useDarkMode(false);
  const [isDarkModeCustom, enableCustom, disableCustom] = useDarkModeCustomSilver();
  useEffect(() => {
    if (isDarkMode === true) {
      disable();
    }
  }, [isDarkMode]);

  return (
    <UserProvider>
      <I18nextProvider i18n={i18n}>
        <CustodyWrapperProvider>
          <AuthProvider>
            <CustodyUserProvider>
              <FeatureToggleProvider>
                <QueryClientProvider client={queryClient}>
                  <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                    <GlobalStyles />

                    <FeatureToggleProvider>
                      <Suspense fallback={<></>}>
                        <CustomThemeProvider isDarkMode={isDarkMode}>
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            {children}
                          </LocalizationProvider>
                        </CustomThemeProvider>
                      </Suspense>
                    </FeatureToggleProvider>
                    <ToastProvider />
                  </ThemeProvider>
                </QueryClientProvider>
              </FeatureToggleProvider>
            </CustodyUserProvider>
          </AuthProvider>
        </CustodyWrapperProvider>
      </I18nextProvider>
    </UserProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AppProviders;
