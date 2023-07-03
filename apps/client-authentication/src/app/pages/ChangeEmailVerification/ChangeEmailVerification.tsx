import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { ChangeEmailVerificationComponent } from "./ChangeEmailVerification.component";
import { ChangeEmailVerificationProvider } from "./ChangeEmailVerification.provider";
import { IChangeEmailVerificationProps } from "./ChangeEmailVerification.types";

export const ChangeEmailVerification: FC<IChangeEmailVerificationProps> = (
  props: IChangeEmailVerificationProps
) => {
  return (
    <ChangeEmailVerificationProvider>
      <AuthWrapper hideFAQ>
        <ChangeEmailVerificationComponent />
      </AuthWrapper>
    </ChangeEmailVerificationProvider>
  );
};
