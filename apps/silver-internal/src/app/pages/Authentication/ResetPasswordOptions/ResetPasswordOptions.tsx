import { FC } from "react";

import { ResetPasswordOptionsComponent } from "./ResetPasswordOptions.component";
import { ResetPasswordOptionsProvider } from "./ResetPasswordOptions.provider";
import { IResetPasswordOptionsProps } from "./ResetPasswordOptions.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

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
