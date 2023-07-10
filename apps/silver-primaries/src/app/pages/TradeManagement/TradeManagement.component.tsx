import { FC } from "react";

import * as Styles from "./TradeManagement.styles";
import { ITradeManagementProps } from "./TradeManagement.types";

export const TradeManagementComponent: FC< ITradeManagementProps> = ({children}: ITradeManagementProps) => {
  return <Styles.TradeManagement>TradeManagement</Styles.TradeManagement>
};
