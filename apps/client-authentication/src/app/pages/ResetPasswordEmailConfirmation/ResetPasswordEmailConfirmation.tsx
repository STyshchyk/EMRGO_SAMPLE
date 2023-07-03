import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { ResetPasswordEmailConfirmationComponent } from "./ResetPasswordEmailConfirmation.component";
import { ResetPasswordEmailConfirmationProvider } from "./ResetPasswordEmailConfirmation.provider";
import { IResetPasswordEmailConfirmationProps } from "./ResetPasswordEmailConfirmation.types";

export const ResetPasswordEmailConfirmation: FC<IResetPasswordEmailConfirmationProps> = (
  props: IResetPasswordEmailConfirmationProps
) => {
  return (
    <ResetPasswordEmailConfirmationProvider>
      <AuthWrapper>
        <ResetPasswordEmailConfirmationComponent />
      </AuthWrapper>
    </ResetPasswordEmailConfirmationProvider>
  );
};
