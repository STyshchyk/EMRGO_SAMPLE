import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { CompleteRegistrationComponent } from "./CompleteRegistration.component";
import { CompleteRegistrationProvider } from "./CompleteRegistration.provider";
import { ICompleteRegistrationProps } from "./CompleteRegistration.types";

export const CompleteRegistration: FC<
  ICompleteRegistrationProps
> = ({}: ICompleteRegistrationProps) => {
  return (
    <CompleteRegistrationProvider>
      <AuthWrapper hideFAQ>
        <CompleteRegistrationComponent />
      </AuthWrapper>
    </CompleteRegistrationProvider>
  );
};
