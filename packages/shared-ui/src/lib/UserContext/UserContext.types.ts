import { IUser } from "@emrgo-frontend/types";

export interface IUserContextProps {}

export interface IUserData {
  user: IUser | null;
  updateUser: (user: IUser | null) => void;
  removeUser: () => void;
}
