import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { UserProvider as SilverUserProvider, ToastProvider } from "@emrgo-frontend/shared-ui";
import { darkTheme, GlobalStyles, lightTheme } from "@emrgo-frontend/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { AuthProvider } from "../../context/auth-context";
import { FeatureToggleProvider } from "../../context/feature-toggle-context";
import { CustomThemeProvider } from "../../context/theme-context";
import { UserProvider } from "../../context/user-context";
import i18n from "../../i18n";

const AppProviders = ({ children }) => {
  const { isDarkMode } = useDarkMode(false);

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <UserProvider>
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
            </SilverUserProvider>
          </ThemeProvider>
        </UserProvider>
      </AuthProvider>
    </I18nextProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AppProviders;
