export interface IUserConfigData {
  user: IUser | null;
  roles: string[];
  permissions: string[];
}

export interface IUser {
  email: string;
  phone: string;
  entityId: string;
  entityName: string;
  firstName: string;
  groupId: string;
  hasAcceptedClientTerms: boolean;
  hasAcceptedSilverTnc: boolean;
  id: string;
  lastName: string;
  mfaEnabled: boolean;
  mfaType: string;
  role: string;
  tncAcceptedVersion: string | number | null;
  clientKycStatus: number;
  entityKycStatus: number;
  entityCustodyKycStatus: number;
  verifyMFA?: boolean;
}
