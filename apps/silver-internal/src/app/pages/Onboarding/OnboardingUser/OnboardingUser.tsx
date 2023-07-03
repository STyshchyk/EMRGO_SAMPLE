import { FC } from "react";

import { OnboardingUserComponent } from "./OnboardingUser.component";
import { OnboardingUserProvider } from "./OnboardingUser.provider";
import { IOnboardingUserProps } from "./OnboardingUser.types";

export const OnboardingUser: FC<IOnboardingUserProps> = ({}: IOnboardingUserProps) => {
  return (
    <OnboardingUserProvider>
      <OnboardingUserComponent />
    </OnboardingUserProvider>
  );
};
