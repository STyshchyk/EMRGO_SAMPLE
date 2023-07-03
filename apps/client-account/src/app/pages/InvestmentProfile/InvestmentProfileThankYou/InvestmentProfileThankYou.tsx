import { FC } from "react";

import { AuthWrapper } from "../../../components/AuthWrapper";
import { InvestmentProfileThankYouComponent } from "./InvestmentProfileThankYou.component";
import { InvestmentProfileThankYouProvider } from "./InvestmentProfileThankYou.provider";
import { IInvestmentProfileThankYouProps } from "./InvestmentProfileThankYou.types";

export const InvestmentProfileThankYou: FC<IInvestmentProfileThankYouProps> = (
  props: IInvestmentProfileThankYouProps
) => {
  return (
    <InvestmentProfileThankYouProvider>
      <AuthWrapper>
        <InvestmentProfileThankYouComponent />
      </AuthWrapper>
    </InvestmentProfileThankYouProvider>
  );
};
