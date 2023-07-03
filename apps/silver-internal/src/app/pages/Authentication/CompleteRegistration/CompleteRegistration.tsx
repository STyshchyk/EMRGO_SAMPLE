import { FC } from "react";


import { CompleteRegistrationComponent } from "./CompleteRegistration.component";
import { CompleteRegistrationProvider } from "./CompleteRegistration.provider";
import { ICompleteRegistrationProps } from "./CompleteRegistration.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

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
