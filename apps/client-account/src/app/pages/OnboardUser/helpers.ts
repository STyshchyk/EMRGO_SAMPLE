import { TNewUserStatus,TNewUserTypes,UserRoles, UserStatus } from "./EntityManagement.types";

const newUserTypeLabels: Record<TNewUserTypes, string> = {
  [UserRoles.superUser]: "Admin",
  [UserRoles.investmentManager]: "Investor",

};
    
const newUserStatusLabel: Record<TNewUserStatus, string> = {
  [UserStatus.invited]: "Invited",
  [UserStatus.cancelled]: "Cancelled",
  [UserStatus.onboarded]: "Onboarded",
};

export const getNewUserTypeLabel = (type: TNewUserTypes) => {
  return newUserTypeLabels[type];
};

export const getNewUserStatusLabel = (status: TNewUserStatus) => {
  return newUserStatusLabel[status];
};
  