import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { KYCComponent } from "./KYC.component";
import { KYCProvider } from "./KYC.provider";
import { IKYCProps } from "./KYC.types";

export const KYC: FC<IKYCProps> = (props: IKYCProps) => {
  return (
    <KYCProvider>
      <AuthWrapper backUrl="/" hideFAQ>
        <KYCComponent />
      </AuthWrapper>
    </KYCProvider>
  );
};
