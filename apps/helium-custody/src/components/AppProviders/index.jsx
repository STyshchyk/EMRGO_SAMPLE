import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import PropTypes from "prop-types";

import { AuthProvider } from "../../context/auth-context";
import { CustodyWrapperProvider } from "../../context/custody-context";
import { FeatureToggleProvider } from "../../context/feature-toggle-context";
import { CustomThemeProvider } from "../../context/theme-context";
import { UserProvider } from "../../context/user-context";
import i18n from "../../i18n";

const AppProviders = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <CustodyWrapperProvider>
      <AuthProvider>
        <UserProvider>
          <FeatureToggleProvider>
            <Suspense fallback={<h2>Loading theme...</h2>}>
              <CustomThemeProvider>
                <LocalizationProvider dateAdapter={AdapterMoment}>{children}</LocalizationProvider>
              </CustomThemeProvider>
            </Suspense>
          </FeatureToggleProvider>
        </UserProvider>
      </AuthProvider>
    </CustodyWrapperProvider>
  </I18nextProvider>
);

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AppProviders;
