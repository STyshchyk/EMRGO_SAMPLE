import { FC } from "react";

import * as Styles from "./TicketTitle.styles";
import { ITicketTitleProps } from "./TicketTitle.types";

export const TicketTitle: FC<ITicketTitleProps> = ({ children }: ITicketTitleProps) => {
  return <Styles.TicketTitle>{children}</Styles.TicketTitle>;
};
