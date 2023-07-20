

export interface IIvitedUsersTableProps {
  users: INewUser[];
}
export interface INewUser {
  id?: string;
  firstName: string,
  lastName: string,
  middleName?: string,
  role: string,
  email: string,
}
