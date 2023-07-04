import { FC } from "react";

import { AuthWrapper } from "../../../components/AuthWrapper";
import { ResetPasswordSixDigitCodeComponent } from "./ResetPasswordSixDigitCode.component";
import { ResetPasswordSixDigitCodeProvider } from "./ResetPasswordSixDigitCode.provider";
import { IResetPasswordSixDigitCodeProps } from "./ResetPasswordSixDigitCode.types";

export const ResetPasswordSixDigitCode: FC<IResetPasswordSixDigitCodeProps> = ({
  method,
}: IResetPasswordSixDigitCodeProps) => {
  return (
    <ResetPasswordSixDigitCodeProvider>
      <AuthWrapper>
        <ResetPasswordSixDigitCodeComponent method={method} />
      </AuthWrapper>
    </ResetPasswordSixDigitCodeProvider>
  );
};
