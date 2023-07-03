import { FC } from "react";

import { AccountsWrapper } from "../../components/AccountsWrapper/AccountsWrapper";
import { PlatformAccessComponent } from "./PlatformAccess.component";
import { PlatformAccessProvider } from "./PlatformAccess.provider";
import { IPlatformAccessProps } from "./PlatformAccess.types";

export const PlatformAccess: FC<IPlatformAccessProps> = (props: IPlatformAccessProps) => {
  return (
    <AccountsWrapper>
      <PlatformAccessProvider>
        <PlatformAccessComponent />
      </PlatformAccessProvider>
    </AccountsWrapper>
  );
};
