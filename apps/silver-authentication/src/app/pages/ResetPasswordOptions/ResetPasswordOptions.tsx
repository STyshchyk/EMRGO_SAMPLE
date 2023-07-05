import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { ResetPasswordOptionsComponent } from "./ResetPasswordOptions.component";
import { ResetPasswordOptionsProvider } from "./ResetPasswordOptions.provider";
import { IResetPasswordOptionsProps } from "./ResetPasswordOptions.types";

export const ResetPasswordOptions: FC<
  IResetPasswordOptionsProps
> = ({}: IResetPasswordOptionsProps) => {
  return (
    <ResetPasswordOptionsProvider>
      <AuthWrapper>
        <ResetPasswordOptionsComponent />
      </AuthWrapper>
    </ResetPasswordOptionsProvider>
  );
};
