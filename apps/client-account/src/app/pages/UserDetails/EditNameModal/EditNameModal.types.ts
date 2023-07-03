import { IUser } from "@emrgo-frontend/types";

export interface IEditNameModalFormProps {
  firstName: string;
  lastName: string;
}

export interface IEditNameModalProps {
  user: IUser | null;
}
