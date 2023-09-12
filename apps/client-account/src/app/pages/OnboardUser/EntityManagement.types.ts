import { PropsWithChildren } from "react";

export enum UserRoles {
  superUser = "admin",
  investmentManager = "invst_mngr",
}

export enum UserStatus {
  invited = "invited",
  onboarded = "onboarded",
  cancelled = "cancelled",
}

// export type TNewUserStatus = "invited" | "onboarded" | "cancelled";

export type TNewUserStatus = UserStatus.invited | UserStatus.onboarded | UserStatus.cancelled;

export type TNewUserTypes = UserRoles.superUser | UserRoles.investmentManager;
export interface IEntityManagementProps extends PropsWithChildren {}

export interface IRole {
  label: string;
  value: string;
}

export interface INewUser {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  roles: TNewUserTypes[] | null;
  email: string;
  invitationStatus?: TNewUserStatus;
}

export interface IMakeOrRevokeAdminRequestPayload {
  id: string;
  isAdmin: boolean;
}

export interface IEntityManagementContext {
  isOnboardUserModalOpen: boolean;
  setIsOnboardUserModalOpen: (flag: boolean) => void;

  onViewPlatformDetails: () => void;
  onViewBankingDetails: () => void;
  onViewCashAccounts: () => void;
  onViewAuthRepresentatives: () => void;

  handleSubmit: (values: INewUser) => void;
  onboardedUsers: INewUser[] | undefined;
  rolesList: IRole[];

  onArchiveUser: (id: string) => void;
  onCancelInvitation: (id: string) => void;
  onResendInvitation: (id: string) => void;
  onMakeAdmin: (id: string) => void;
  onRevokeAdmin: (id: string) => void;
}
