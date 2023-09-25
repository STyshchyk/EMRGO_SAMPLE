import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { useDarkModeCustom } from "@emrgo-frontend/services";
import { UserProvider } from "@emrgo-frontend/shared-ui";
import { lightTheme } from "@emrgo-frontend/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "usehooks-ts";

import { AuthProvider } from "../../context/auth-context";
import { CustodyWrapperProvider } from "../../context/custody-context";
import { FeatureToggleProvider } from "../../context/feature-toggle-context";
import { CustomThemeProvider } from "../../context/theme-context";
import i18n from "../../i18n";

const AppProviders = ({ children }) => {
  const { isDarkMode, disable } = useDarkMode(false);
  const [isDarkModeCustom, enableCustom, disableCustom] = useDarkModeCustom();
  if (isDarkMode === true) {
    disable();
  }

  return (
    <I18nextProvider i18n={i18n}>
      <CustodyWrapperProvider>
        <AuthProvider>
          <UserProvider>
            <FeatureToggleProvider>
              <Suspense fallback={<h2>Loading theme...</h2>}>
                <ThemeProvider theme={lightTheme}>
                  <CustomThemeProvider isDarkMode={false}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      {children}
                    </LocalizationProvider>
                  </CustomThemeProvider>
                </ThemeProvider>
              </Suspense>
            </FeatureToggleProvider>
          </UserProvider>
        </AuthProvider>
      </CustodyWrapperProvider>
    </I18nextProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AppProviders;
