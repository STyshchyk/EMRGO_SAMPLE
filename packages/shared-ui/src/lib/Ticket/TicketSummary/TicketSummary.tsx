import { FC } from "react";

import * as Styles from "./TicketSummary.styles";
import { ITicketSummaryProps } from "./TicketSummary.types";

export const TicketSummary: FC<ITicketSummaryProps> = ({ children }: ITicketSummaryProps) => {
  return <Styles.TicketSummary>{children}</Styles.TicketSummary>;
};
