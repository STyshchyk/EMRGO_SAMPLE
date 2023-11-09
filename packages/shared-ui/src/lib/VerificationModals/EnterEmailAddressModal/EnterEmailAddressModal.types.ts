import { IResetPasswordValues } from "@emrgo-frontend/types";

export interface IEnterEmailAddressFormProps {
  email: string;
  code: string;
  verificationType: string; 
}
export interface IEnterEmailAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetPassword: (values: IResetPasswordValues) => void;
}


