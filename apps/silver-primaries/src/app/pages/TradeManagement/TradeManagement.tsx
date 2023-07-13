import { FC } from "react";

import { ITradeManagementProps } from "./TradeManagement.types";
import { TradeManagementProvider } from "./TradeManagement.provider";
import { TradeManagementComponent } from "./TradeManagement.component";

export const TradeManagement: FC<ITradeManagementProps> = ({}: ITradeManagementProps) => {
  return (
    <TradeManagementProvider>
      <TradeManagementComponent />
    </TradeManagementProvider>
  );
};
