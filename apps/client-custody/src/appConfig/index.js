/* eslint-disable no-underscore-dangle */

const parseFeatureFlags = (value) => {
  if (value) return value.split(",");

  return [];
};

const generateAppConfig = (environment) => ({
  appENV: environment.REACT_APP_ENV,
  appRegion: environment.REACT_APP_REGION,
  baseAPIURL: environment.REACT_APP_BASE_API_URL,
  appEnable2FA: environment.REACT_APP_ENABLE_2FA,
  featureFlags: parseFeatureFlags(environment.REACT_APP_FEATURE_FLAGS),
});

const appConfig = ["development", "test"].includes(process.env.NODE_ENV)
  ? generateAppConfig(process.env)
  : generateAppConfig(window.__ENV);

export default appConfig;
