import { FC } from "react";

import { AccountsWrapper } from "../../components/AccountsWrapper/AccountsWrapper";
import { AccountSecurityComponent } from "./AccountSecurity.component";
import { AccountSecurityProvider } from "./AccountSecurity.provider";
import { IAccountSecurityProps } from "./AccountSecurity.types";

export const AccountSecurity: FC<IAccountSecurityProps> = (props: IAccountSecurityProps) => {
  return (
    <AccountsWrapper>
      <AccountSecurityProvider>
        <AccountSecurityComponent />
      </AccountSecurityProvider>
    </AccountsWrapper>
  );
};
