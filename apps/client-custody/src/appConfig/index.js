/* eslint-disable no-underscore-dangle */

const parseFeatureFlags = (value) => {
  if (value) return value.split(",");

  return [];
};

const generateAppConfig = (environment) => ({
  appENV: "local",
  appRegion: environment.VITE_APP_REGION,
  baseAPIURL: environment.VITE_API_URL,
  appEnable2FA: environment.VITE_APP_ENABLE_2FA,
  featureFlags: parseFeatureFlags(environment.VITE_APP_FEATURE_FLAGS),
});

const appConfig = generateAppConfig(import.meta.env);

export default appConfig;
