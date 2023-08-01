import { IMFA } from "../../services";
export interface IUserContextProps {}


export interface IUser {
  email: string;
  entityId: string;
  entityName: string;
  firstName: string;
  groupId: string;
  hasAcceptedClientTerms: boolean;
  id: string;
  lastName: string;
  mfaEnabled: boolean;
  mfaType: string | null;
  role: string;
  tncAcceptedVersion: string | number | null;
  verifyMFA?: boolean;
}

export interface IUserData {
  user: IUser | null;
  mfa: IMFA | null,

  updateUser: (user: IUser | null) => void;
  removeUser: () => void;
  setVerifyMFA: (flag: boolean) => void;
  setMFA: (mfa: IMFA) => void;
}
