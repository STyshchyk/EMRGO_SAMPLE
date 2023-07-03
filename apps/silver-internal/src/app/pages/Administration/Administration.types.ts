import { UserRoles } from "./Users/InviteUserModal/InviteUser.types";

export interface IAdministrationProps {}

export interface IAdministrationContext {
  numberOfNewTradeOpportunities: number;
  getUsers: () => void;
}

export type TInvitedUserTypes =
  | UserRoles.compliance
  | UserRoles.finance
  | UserRoles.operationsPlatformSolutions
  | UserRoles.relationshipManagerSales
  | UserRoles.superUser;

export type TInvitedUserStatus = "invited" | "onboarded" | "canceled";

export interface IUser {
  id: number;
  bank: number;
}
