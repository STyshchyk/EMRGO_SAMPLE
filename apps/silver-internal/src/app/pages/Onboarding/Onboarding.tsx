import { FC } from "react";

import { OnboardingComponent } from "./Onboarding.component";
import { OnboardingProvider } from "./Onboarding.provider";
import { IOnboardingProps } from "./Onboarding.types";

export const Onboarding: FC<IOnboardingProps> = ({}: IOnboardingProps) => {
  return (
    <OnboardingProvider>
      <OnboardingComponent />
    </OnboardingProvider>
  );
};
