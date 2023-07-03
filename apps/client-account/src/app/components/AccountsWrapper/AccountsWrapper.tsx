import { FC } from "react";

import { ClientDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { AccountsWrapperComponent } from "./AccountsWrapper.component";
import { AccountsWrapperProvider } from "./AccountsWrapper.provider";
import { IAccountsWrapperProps } from "./AccountsWrapper.types";

export const AccountsWrapper: FC<IAccountsWrapperProps> = ({ children }) => {
  return (
    <ClientDashboardWrapper>
      <AccountsWrapperProvider>
        <AccountsWrapperComponent>{children}</AccountsWrapperComponent>
      </AccountsWrapperProvider>
    </ClientDashboardWrapper>
  );
};
