import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { UserProvider as SilverUserProvider, ToastProvider } from "@emrgo-frontend/shared-ui";
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
import { UserProvider } from "../../context/user-context";
import i18n from "../../i18n";

const AppProviders = ({ children }) => {
  const { isDarkMode } = useDarkMode(false);

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

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
              <GlobalStyles />
              <SilverUserProvider>
                <FeatureToggleProvider>
                  <Suspense fallback={<h2>Loading theme...</h2>}>
                    <CustomThemeProvider isDarkMode={isDarkMode}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        {children}
                      </LocalizationProvider>
                    </CustomThemeProvider>
                  </Suspense>
                </FeatureToggleProvider>
                <ToastProvider />
              </SilverUserProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </UserProvider>
      </AuthProvider>
    </I18nextProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AppProviders;
