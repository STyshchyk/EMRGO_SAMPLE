import { IMFA, IUser, IUserConfigData } from "@emrgo-frontend/types";

export interface IUserContextProps {}

export interface IUserData {
  user?: IUser | null;
  roles?: string[] | null;
  permissions?: string[] | null;
  mfa?: IMFA | null;

  updateUserConfig: (user: IUserConfigData | null) => void;
  updateUser: (user: IUser | null) => void;
  updateLegacyUser: (user: any | null) => void;
  removeUser: () => void;
  setVerifyMFA?: (flag: boolean) => void;
  setMFA?: (mfa: IMFA) => void;
}
