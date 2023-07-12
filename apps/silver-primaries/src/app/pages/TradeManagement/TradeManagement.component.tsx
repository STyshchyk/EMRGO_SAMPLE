import { FC } from "react";

import { DashboardContent } from "@emrgo-frontend/shared-ui";

import { getExecutedStatusLabel } from "../helpers";
import { ExecutedTableComponent } from "./ExecutedTable";
import * as Styles from "./TradeManagement.styles";
import { ITradeManagementProps } from "./TradeManagement.types";

export const TradeManagementComponent: FC<ITradeManagementProps> = ({ children }: ITradeManagementProps) => {
  return (
    <Styles.TradeManagement>
      <DashboardContent>
        <ExecutedTableComponent />
      </DashboardContent>
    </Styles.TradeManagement>
  );
};
