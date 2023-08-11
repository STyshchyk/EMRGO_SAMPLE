import { FC } from "react";

import { IOnboardUserProps } from "./OnboardUser.types";
import { OnboardUserProvider } from "./OnboardUser.provider";
import { OnboardUserComponent } from "./OnboardUser.component";

export const OnboardUser: FC<IOnboardUserProps> = ({}: IOnboardUserProps) => {
  return (
    <OnboardUserProvider>
      <OnboardUserComponent />
    </OnboardUserProvider>
  );
};
