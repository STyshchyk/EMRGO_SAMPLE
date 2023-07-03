import { FC } from "react";

import * as Styles from "./TicketText.styles";
import { ITicketTextProps } from "./TicketText.types";

export const TicketText: FC<ITicketTextProps> = ({ children }: ITicketTextProps) => {
  return <Styles.TicketText>{children}</Styles.TicketText>;
};
