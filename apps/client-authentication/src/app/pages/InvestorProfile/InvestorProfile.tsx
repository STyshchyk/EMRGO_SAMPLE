import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { InvestorProfileComponent } from "./InvestorProfile.component";
import { InvestorProfileProvider } from "./InvestorProfile.provider";
import { IInvestorProfileProps } from "./InvestorProfile.types";

export const InvestorProfile: FC<IInvestorProfileProps> = (props: IInvestorProfileProps) => {
  return (
    <InvestorProfileProvider>
      <AuthWrapper>
        <InvestorProfileComponent />
      </AuthWrapper>
    </InvestorProfileProvider>
  );
};
