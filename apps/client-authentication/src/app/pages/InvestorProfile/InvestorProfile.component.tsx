import { FC } from "react";

import * as Styles from "./InvestorProfile.styles";
import { IInvestorProfileProps } from "./InvestorProfile.types";

export const InvestorProfileComponent: FC<IInvestorProfileProps> = (props: IInvestorProfileProps) => {
  return <Styles.InvestorProfile>InvestorProfile</Styles.InvestorProfile>;
};
