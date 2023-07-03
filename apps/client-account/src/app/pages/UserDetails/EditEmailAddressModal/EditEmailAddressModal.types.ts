import { IUser } from "@emrgo-frontend/types";

export interface IEditEmailAddressModalFormProps {
  email: string;
}

export interface IEditEmailAddressModalProps {
  user: IUser | null;
}
