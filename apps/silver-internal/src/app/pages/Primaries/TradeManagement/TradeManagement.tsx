import { FC } from "react";

import { TradeManagementComponent } from "./TradeManagement.component";
import { TradeManagementProvider } from "./TradeManagement.provider";
import { ITradeManagementProps } from "./TradeManagement.types";

export const TradeManagement: FC<ITradeManagementProps> = ({}: ITradeManagementProps) => {
  return (
    <TradeManagementProvider>
      <TradeManagementComponent />
    </TradeManagementProvider>
  );
};
