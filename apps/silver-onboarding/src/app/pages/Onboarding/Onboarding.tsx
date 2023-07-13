import { FC } from "react";

import { OnboardingComponent } from "./Onboarding.component";
import { OnboardingProvider } from "./Onboarding.provider";
import { IOnboardingProps } from "./Onboarding.types";
import { SilverDashboardWrapper } from "@emrgo-frontend/shared-ui";

export const Onboarding: FC<IOnboardingProps> = ({}: IOnboardingProps) => {
  return (
    <SilverDashboardWrapper>
      <OnboardingProvider>
        <OnboardingComponent />
      </OnboardingProvider>
    </SilverDashboardWrapper>
  );
};
