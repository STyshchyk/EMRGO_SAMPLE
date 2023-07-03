import { IUser } from "@emrgo-frontend/types";

export interface IEditPhoneNumberModalFormProps {
  phone: string;
}

export interface IEditPhoneNumberModalProps {
  user: IUser | null;
}

export interface IVerifyPhoneNumberModalFormProps {
  code: string;
}
