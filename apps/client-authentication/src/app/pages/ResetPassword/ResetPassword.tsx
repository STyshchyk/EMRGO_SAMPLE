import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { ResetPasswordComponent } from "./ResetPassword.component";
import { ResetPasswordProvider } from "./ResetPassword.provider";
import { IResetPasswordProps } from "./ResetPassword.types";

export const ResetPassword: FC<IResetPasswordProps> = (props: IResetPasswordProps) => {
  const parentUrl = "/login";

  return (
    <ResetPasswordProvider>
      <AuthWrapper backUrl={parentUrl}>
        <ResetPasswordComponent />
      </AuthWrapper>
    </ResetPasswordProvider>
  );
};
