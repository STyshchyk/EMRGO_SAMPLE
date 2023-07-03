export interface ISetupTwoFactorAuthenticationModalProps {
  isOpen: boolean;
  onBack: () => void;
  isQRCodeLoading?: boolean;
  authenticatorURL?: string;
  onSetup: (otp: string) => void;
}

export interface ISetupTwoFactorAuthenticationFormProps {
  otp: string;
}
