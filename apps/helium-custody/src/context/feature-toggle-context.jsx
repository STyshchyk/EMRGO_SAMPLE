import * as React from "react";

import PropTypes from "prop-types";

import appConfig from "../appConfig";
import featureFlags from "../constants/featureFlags";

const FeatureToggleContext = React.createContext();
FeatureToggleContext.displayName = "FeatureToggle";

const FeatureToggleProvider = ({ children }) => (
  <FeatureToggleContext.Provider
    value={{
      enabledFeatures: appConfig.featureFlags,
    }}
  >
    {children}
  </FeatureToggleContext.Provider>
);

FeatureToggleProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

const useFeatureToggle = () => {
  const contextObject = React.useContext(FeatureToggleContext);

  if (contextObject === undefined) {
    throw new Error(
      "useFeatureToggle hook must be called within a FeatureToggleProvider component"
    );
  }

  const { enabledFeatures } = contextObject;

  return {
    ...contextObject,
    checkFeatureFlag: (featureFlag) => {
      const listOfValidFeatureFlagNames = Object.values(featureFlags);

      if (!listOfValidFeatureFlagNames.length > 0) return false;

      if (!listOfValidFeatureFlagNames.includes(featureFlag))
        throw new Error(
          "Provided feature flag name is non-existent. Consult `src/constants/featureFlags.js file for the list of pre-defined feature flag names`"
        );

      return enabledFeatures.includes(featureFlag);
    },
  };
};

export { FeatureToggleProvider, useFeatureToggle };
