import { PropsWithChildren } from "react";


export interface IEntityManagementProps extends PropsWithChildren {
}


export interface INewUser {
  id?: string;
  firstName: string,
  lastName: string,
  middleName?: string,
  roles: string[],
  email: string,
}
export interface IEntityManagementContext {
  isOnboardUserModalOpen: boolean,
  setIsOnboardUserModalOpen: (flag: boolean) => void
  onViewPlatformDetails: () => void;
  onViewBankingDetails: () => void;
  onViewCashAccounts: () => void;
  onViewAuthRepresentatives: () => void;
  onboardedUsers: INewUser[] | undefined
}


