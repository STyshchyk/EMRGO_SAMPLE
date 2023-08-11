import { TNewUserStatus,TNewUserTypes,UserRoles } from "./EntityManagement.types";

const newUserTypeLabels: Record<TNewUserTypes, string> = {
    [UserRoles.superUser]: "Admin",
    [UserRoles.investmentManager]: "Investor",

  };
  
  const newUserStatusLabel: Record<TNewUserStatus, string> = {
    invited: "Invited",
    cancelled: "Cancelled",
    onboarded: "Onboarded",
  };
  
  export const getNewUserTypeLabel = (type: TNewUserTypes) => {
    return newUserTypeLabels[type];
  };
  
  export const getNewUserStatusLabel = (status: TNewUserStatus) => {
    return newUserStatusLabel[status];
  };
  