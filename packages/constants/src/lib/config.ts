export const config = {
  RECAPTCHA_SITE_KEY: import.meta.env["VITE_RECAPTCHA_SITE_KEY"] ?? "",
  VITE_API_URL: import.meta.env["VITE_API_URL"] ?? "",
  VITE_APP_FEATURE_FLAGS: import.meta.env["VITE_APP_FEATURE_FLAGS"] ?? "",
};
