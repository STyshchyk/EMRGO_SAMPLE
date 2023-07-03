import { FC } from "react";

import { SignupWrapper } from "~/components/SignupWrapper";

import { KYCThankYouComponent } from "./KYCThankYou.component";
import { KYCThankYouProvider } from "./KYCThankYou.provider";
import { IKYCThankYouProps } from "./KYCThankYou.types";

export const KYCThankYou: FC<IKYCThankYouProps> = ({}: IKYCThankYouProps) => {
  return (
    <KYCThankYouProvider>
      <SignupWrapper>
        <KYCThankYouComponent />
      </SignupWrapper>
    </KYCThankYouProvider>
  );
};
