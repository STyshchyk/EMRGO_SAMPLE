import { I18nextProvider } from 'react-i18next';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

import { AuthProvider } from '../../context/auth-context';
import { CustomThemeProvider } from '../../context/theme-context';
import { FeatureToggleProvider } from '../../context/feature-toggle-context';
import { UserProvider } from '../../context/user-context';
import i18n from '../../i18n';

const AppProviders = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <UserProvider>
        <FeatureToggleProvider>
          <Suspense fallback={<h2>Loading theme...</h2>}>
            <CustomThemeProvider>{children}</CustomThemeProvider>
          </Suspense>
        </FeatureToggleProvider>
      </UserProvider>
    </AuthProvider>
  </I18nextProvider>
);

AppProviders.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default AppProviders;
