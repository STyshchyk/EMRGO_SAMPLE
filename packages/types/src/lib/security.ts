export type TSecureAccountFlowView =
  | "initial"
  | "setup-two-factor-auth"
  | "add-corporate-mobile"
  | "enter-otp-code"
  | "corporate-mobile-success"
  | undefined;

export type TSecureAccountFlowOption = "text" | "app";

export type TResetPasswordFlowView = "enter-email-address" | undefined;
