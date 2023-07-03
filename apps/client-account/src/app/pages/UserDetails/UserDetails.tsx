import { FC } from "react";

import { AccountsWrapper } from "../../components/AccountsWrapper/AccountsWrapper";
import { UserDetailsComponent } from "./UserDetails.component";
import { UserDetailsProvider } from "./UserDetails.provider";
import { IUserDetailsProps } from "./UserDetails.types";

export const UserDetails: FC<IUserDetailsProps> = (provider: IUserDetailsProps) => {
  return (
    <AccountsWrapper>
      <UserDetailsProvider>
        <UserDetailsComponent />
      </UserDetailsProvider>
    </AccountsWrapper>
  );
};
