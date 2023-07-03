import { FC } from "react";

import { PrimariesWrapper } from "../../components/PrimariesWrapper/PrimariesWrapper";
import { TradeOpportunitiesComponent } from "./TradeOpportunities.component";
import { TradeOpportunitiesProvider } from "./TradeOpportunities.provider";
import { ITradeOpportunitiesProps } from "./TradeOpportunities.types";

export const TradeOpportunities: FC<ITradeOpportunitiesProps> = (
  props: ITradeOpportunitiesProps
) => {
  return (
    <PrimariesWrapper>
      <TradeOpportunitiesProvider>
        <TradeOpportunitiesComponent />
      </TradeOpportunitiesProvider>
    </PrimariesWrapper>
  );
};
