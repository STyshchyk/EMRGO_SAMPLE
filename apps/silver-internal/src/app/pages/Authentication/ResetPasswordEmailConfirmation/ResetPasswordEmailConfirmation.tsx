import { FC } from "react";

import { ResetPasswordEmailConfirmationComponent } from "./ResetPasswordEmailConfirmation.component";
import { ResetPasswordEmailConfirmationProvider } from "./ResetPasswordEmailConfirmation.provider";
import { IResetPasswordEmailConfirmationProps } from "./ResetPasswordEmailConfirmation.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

export const ResetPasswordEmailConfirmation: FC<
  IResetPasswordEmailConfirmationProps
> = ({}: IResetPasswordEmailConfirmationProps) => {
  return (
    <ResetPasswordEmailConfirmationProvider>
      <AuthWrapper>
        <ResetPasswordEmailConfirmationComponent />
      </AuthWrapper>
    </ResetPasswordEmailConfirmationProvider>
  );
};
