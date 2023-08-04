import { IMFA,IUser } from "@emrgo-frontend/types";

export interface IUserContextProps {}

export interface IUserData {
  user: IUser | null;
  mfa?: IMFA | null,

  updateUser: (user: IUser | null) => void;
  removeUser: () => void;
  setVerifyMFA?: (flag: boolean) => void;
  setMFA?: (mfa: IMFA) => void;
}

