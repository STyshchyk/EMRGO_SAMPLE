import { FC } from "react";

import * as Styles from "./TicketFooter.styles";
import { ITicketFooterProps } from "./TicketFooter.types";

export const TicketFooter: FC<ITicketFooterProps> = ({ children }: ITicketFooterProps) => {
  return <Styles.TicketFooter>{children}</Styles.TicketFooter>;
};
