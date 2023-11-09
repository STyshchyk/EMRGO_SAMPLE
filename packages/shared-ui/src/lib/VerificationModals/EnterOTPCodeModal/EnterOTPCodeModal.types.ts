export interface IEnterOTPCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetup: (code: string) => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  inputLabel?: string;
}

export interface IEnterOTPCodeModalFormProps {
  code: string;
}
