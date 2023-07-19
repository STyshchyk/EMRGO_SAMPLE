

export interface IIvitedUsersTableProps {
  users: INewUser[];
}
export interface INewUser {
  firstName: string,
  lastName: string,
  middleName?: string,
  role: string,
  email: string,
}
