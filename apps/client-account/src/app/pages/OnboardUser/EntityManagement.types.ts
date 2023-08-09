import { PropsWithChildren } from "react";

export enum UserRoles {
  superUser = "admin",
  investmentManager = "invst_mngr"
}

export type TNewUserStatus = "invited" | "onboarded" | "canceled";


export type TNewUserTypes =
  | UserRoles.superUser
  | UserRoles.investmentManager;
export interface IEntityManagementProps extends PropsWithChildren {
}

export interface IRole {
  label:string,
  value: string
}

export interface INewUser {
  id?: string;
  firstName: string,
  lastName: string,
  middleName?: string,
  roles: TNewUserTypes[],
  email: string,
  invitationStatus?: TNewUserStatus,
}

export interface IEntityManagementContext {
  isOnboardUserModalOpen: boolean,
  setIsOnboardUserModalOpen: (flag: boolean) => void

  onViewPlatformDetails: () => void;
  onViewBankingDetails: () => void;
  onViewCashAccounts: () => void;
  onViewAuthRepresentatives: () => void;

  handleSubmit : (values : INewUser ) => void;
  onboardedUsers: INewUser[] | undefined
  rolesList: IRole[]

  onArchiveUser:(id:string) => void
  onCancelInvitation:(id:string) => void
  onResendInvitation:(id:string) => void

}



