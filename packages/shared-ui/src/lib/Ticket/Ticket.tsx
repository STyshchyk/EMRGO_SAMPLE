import { FC } from "react";

import * as Styles from "./Ticket.styles";
import { ITicketProps } from "./Ticket.types";

export const Ticket: FC<ITicketProps> = ({ children }: ITicketProps) => {
  return <Styles.Ticket>{children}</Styles.Ticket>;
};
