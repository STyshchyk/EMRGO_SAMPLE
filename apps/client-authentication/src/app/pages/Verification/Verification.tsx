import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { VerificationComponent } from "./Verification.component";
import { VerificationProvider } from "./Verification.provider";
import { IVerificationProps } from "./Verification.types";

export const Verification: FC<IVerificationProps> = (props: IVerificationProps) => {
  return (
    <VerificationProvider>
      <AuthWrapper>
        <VerificationComponent />
      </AuthWrapper>
    </VerificationProvider>
  );
};
