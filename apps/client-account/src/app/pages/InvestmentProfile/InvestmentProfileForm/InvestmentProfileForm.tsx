import { FC } from "react";

import { InvestmentProfileFormComponent } from "./InvestmentProfileForm.component";
import { InvestmentProfileFormProvider } from "./InvestmentProfileForm.provider";
import { IInvestmentProfileFormProps } from "./InvestmentProfileForm.types";

export const InvestmentProfileForm: FC<
  IInvestmentProfileFormProps
> = (props: IInvestmentProfileFormProps) => {
  return (
    <InvestmentProfileFormProvider>
      <InvestmentProfileFormComponent />
    </InvestmentProfileFormProvider>
  );
};
