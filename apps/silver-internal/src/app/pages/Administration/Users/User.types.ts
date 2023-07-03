import { UserRoles } from "./InviteUserModal/InviteUser.types";

import { IUser, TInvitedUserStatus, TInvitedUserTypes } from "../Administration.types";

export type TFilterType2 = TInvitedUserTypes | "all-types";
export type TFilterStatus2 = TInvitedUserStatus | "all-statuses";

export interface IUserProps {}

export interface IUserContext {
  isAboutUsDisplayed: boolean;
  setIsAboutUsDisplayed: (isAboutUsDisplayed: boolean) => void;
  slides: IHeroSlide[];
  downloadData: () => void;
  data: IBank[];
  toggleIssuanceOnWatchlist: (id: number, flag?: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: TFilterType2;
  setFilterType: (type: TFilterType2) => void;
  filterStatus: TFilterStatus2;
  setFilterStatus: (status: TFilterStatus2) => void;
  getUsers: () => void;
}

export interface IHeroSlide {
  title: string;
  description: string;
}

export interface IBank {
  id: number;
  name: string;
  logo: {
    dark: string;
    light: string;
  };
  issuances: IUserIssuance[];
}

export interface IUserIssuance extends IUser {
  isWatched: boolean;
  firstName?: string;
  secondName?: string;
  emailID?: string;
  role?: UserRoles;
  status?: TInvitedUserStatus;
  actions?: string;
}

export interface IUserNew {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRoles | null;
  invitationStatus?: string;
}
