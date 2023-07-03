export interface IEnterOTPCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetup: (otp: string) => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  inputLabel?: string;
}

export interface IEnterOTPCodeModalFormProps {
  otp: string;
}
