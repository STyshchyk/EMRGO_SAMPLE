import { FC } from "react";

import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

import { OnboardingComponent } from "./Onboarding.component";
import { OnboardingProvider } from "./Onboarding.provider";
import { IOnboardingProps } from "./Onboarding.types";

export const Onboarding: FC<IOnboardingProps> = ({}: IOnboardingProps) => {
  return (
    <SilverDashboardWrapper>
      <OnboardingProvider>
        <OnboardingComponent />
      </OnboardingProvider>
    </SilverDashboardWrapper>
  );
};
