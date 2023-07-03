import { FC } from "react";

import { PrimariesWrapper } from "../../components/PrimariesWrapper/PrimariesWrapper";
import { TradeManagementComponent } from "./TradeManagement.component";
import { TradeManagementProvider } from "./TradeManagement.provider";
import { ITradeManagementProps } from "./TradeManagement.types";

export const TradeManagement: FC<ITradeManagementProps> = (props: ITradeManagementProps) => {
  return (
    <PrimariesWrapper>
      <TradeManagementProvider>
        <TradeManagementComponent />
      </TradeManagementProvider>
    </PrimariesWrapper>
  );
};
