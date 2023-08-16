export interface ISetupMFAProps {}

export interface ISetupMFAContext {
  otpauth_url:string,

  onEnableMFA: (otp: string) => void;
  onVerifyMFA: (otp: string) => void;
  onSetupMFA: () => void;

  isQRCodeLoading: boolean;
  authenticatorURL: string;
}

