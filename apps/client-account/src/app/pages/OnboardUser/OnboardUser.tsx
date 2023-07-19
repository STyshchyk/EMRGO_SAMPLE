import { FC } from "react";

import { IOnboardUserProps } from "./OnboardUser.types";
import { OnboardUserProvider } from "./OnboardUser.provider";
import { OnboardUserComponent } from "./OnboardUser.component";
import { AccountsWrapper } from "../../components/AccountsWrapper/AccountsWrapper";

export const OnboardUser: FC<IOnboardUserProps> = ({}: IOnboardUserProps) => {
  return (
    <AccountsWrapper>
        <OnboardUserProvider>
          <OnboardUserComponent />
        </OnboardUserProvider>
    </AccountsWrapper>
  );
};
