import { UserRoles } from "./Users/InviteUserModal/InviteUser.types";

import { TInvitedUserStatus, TInvitedUserTypes } from "./Administration.types";

const invitedUserTypeLables: Record<TInvitedUserTypes, string> = {
  [UserRoles.compliance]: "Compliance",
  [UserRoles.relationshipManagerSales]: "Relationship Manager (Sales)",
  [UserRoles.operationsPlatformSolutions]: "Operations (Platform Solutions)",
  [UserRoles.finance]: "Finance",
  [UserRoles.superUser]: "IT Operations",
};

const invitedUserStatusLabel: Record<TInvitedUserStatus, string> = {
  invited: "Invited",
  canceled: "Canceled",
  onboarded: "Onboarded",
};

export const getInvitedUserTypeLabel = (type: TInvitedUserTypes) => {
  return invitedUserTypeLables[type];
};

export const getInvitedUserStatusLabel = (status: TInvitedUserStatus) => {
  return invitedUserStatusLabel[status];
};
