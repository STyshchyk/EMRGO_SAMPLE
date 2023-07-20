/* eslint-disable no-underscore-dangle */

const parseFeatureFlags = (value) => {
  if (value) return value.split(",");

  return [];
};

const generateAppConfig = (environment) => ({
  appENV: environment.VITE_APP_ENV,
  appRegion: environment.VITE_APP_REGION,
  baseAPIURL: environment.VITE_APP_BASE_API_URL,
  appEnable2FA: environment.VITE_APP_ENABLE_2FA,
  featureFlags: parseFeatureFlags(environment.VITE_APP_FEATURE_FLAGS),
});

const appConfig = ["development", "test"].includes(process.env.NODE_ENV)
  ? generateAppConfig(import.meta.env)
  : generateAppConfig(window.__ENV);

export default appConfig;
