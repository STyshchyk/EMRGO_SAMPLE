import { FC } from "react";

import { ResetPasswordSixDigitCodeComponent } from "./ResetPasswordSixDigitCode.component";
import { ResetPasswordSixDigitCodeProvider } from "./ResetPasswordSixDigitCode.provider";
import { IResetPasswordSixDigitCodeProps } from "./ResetPasswordSixDigitCode.types";
import { AuthWrapper } from "../../../components/AuthWrapper";

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
