export interface IUserConfigData {
  user: IUser | null;
  roles: string[];
  permissions: string[];
  legacyUser?: any;
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
}

export interface IFetchProfileSettings {
  keys: string[];
}

export interface IPostProfileSettings {
  settings: ISettings[];
}

interface ISettings {
  isActive: boolean;
  key: string;
  value: string;
}
