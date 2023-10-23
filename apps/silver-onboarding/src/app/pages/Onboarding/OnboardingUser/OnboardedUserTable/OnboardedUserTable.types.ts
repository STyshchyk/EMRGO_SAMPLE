import { IEntity } from "../OnboarderUsers/OnboardedUsers.types";

export interface IOnboardedUserTableProps {
  onboardedUsers: IEntity[];
}

export interface IOnboarderUser {
  firstName: string;
  lastName: string;
  entityName: string;
  emailID: string;
  clientProfileTS: string;
  kyc: string;
  kycTS: string;
}
