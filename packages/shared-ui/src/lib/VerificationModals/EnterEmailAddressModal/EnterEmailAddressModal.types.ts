export interface IEnterEmailAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEmail: (email: string) => void;
}

export interface IEnterEmailAddressFormProps {
  email: string;
}
