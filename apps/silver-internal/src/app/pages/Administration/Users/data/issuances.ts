import { UserRoles } from "../InviteUserModal/InviteUser.types";
import { IUserIssuance } from "../User.types";

const issuances: IUserIssuance[] = [
  {
    id: 1,
    firstName: "First Name",
    secondName: "Second Name",
    emailID: "Email ID",
    role: UserRoles.finance,
    status: "invited",
    bank: 1,
    isWatched: false,
  },
  {
    id: 2,
    firstName: "First Name",
    secondName: "Second Name",
    emailID: "Email ID",
    role: UserRoles.operationsPlatformSolutions,
    status: "invited",
    bank: 1,
    isWatched: false,
  },
  {
    id: 3,
    firstName: "First Name",
    secondName: "Second Name",
    emailID: "Email ID",
    role: UserRoles.finance,
    status: "invited",
    bank: 1,
    isWatched: false,
  },
  {
    id: 4,
    firstName: "First Name",
    secondName: "Second Name",
    emailID: "Email ID",
    role: UserRoles.relationshipManagerSales,
    status: "invited",
    bank: 1,
    isWatched: false,
  },
  {
    id: 5,
    firstName: "First Name",
    secondName: "Second Name",
    emailID: "Email ID",
    role: UserRoles.operationsPlatformSolutions,
    status: "invited",
    bank: 1,
    isWatched: false,
  },
];

export default issuances;
