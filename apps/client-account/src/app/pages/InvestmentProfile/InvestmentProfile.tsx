import { FC } from "react";

import { AuthWrapper } from "../../components/AuthWrapper";
import { InvestmentProfileComponent } from "./InvestmentProfile.component";
import { InvestmentProfileProvider } from "./InvestmentProfile.provider";
import { IInvestmentProfileProps } from "./InvestmentProfile.types";

export const InvestmentProfile: FC<IInvestmentProfileProps> = (props: IInvestmentProfileProps) => {
  return (
    <AuthWrapper hideFAQ>
      <InvestmentProfileProvider>
        <InvestmentProfileComponent />
      </InvestmentProfileProvider>
    </AuthWrapper>
  );
};
