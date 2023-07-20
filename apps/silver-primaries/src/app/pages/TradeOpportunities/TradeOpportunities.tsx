import { FC } from "react";

import { PrimariesWrapper } from "../../components/PrimariesWrapper";
import { TradeOpportunitiesComponent } from "./TradeOpportunities.component";
import { TradeOpportunitiesProvider } from "./TradeOpportunities.provider";
import { ITradeOpportunitiesProps } from "./TradeOpportunities.types";

export const TradeOpportunities: FC<ITradeOpportunitiesProps> = ({}: ITradeOpportunitiesProps) => {
  return (
    <TradeOpportunitiesProvider>
      <TradeOpportunitiesComponent />
    </TradeOpportunitiesProvider>
  );
};
