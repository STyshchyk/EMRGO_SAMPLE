import { FC } from "react";

import { DashboardContent } from "@emrgo-frontend/shared-ui";

import { OnboardedUsers } from "./OnboarderUsers";
import * as Styles from "./OnboardingUser.styles";
import { IOnboardingUserProps } from "./OnboardingUser.types";

export const OnboardingUserComponent: FC<IOnboardingUserProps> = ({}: IOnboardingUserProps) => {
  return (
    <Styles.OnboardingUser>
      <DashboardContent>
        <OnboardedUsers />
      </DashboardContent>
    </Styles.OnboardingUser>
  );
};
