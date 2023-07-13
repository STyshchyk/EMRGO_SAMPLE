import { FC } from "react";

import { InvitedUsersComponent } from "./InvitedUsers.component";
import { IInvitedUsersProps } from "./InvitedUsers.types";

export const InvitedUsers: FC<IInvitedUsersProps> = ({}: IInvitedUsersProps) => {
  return <InvitedUsersComponent />;
};
