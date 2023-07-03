import { FC } from "react";

import * as Styles from "./TicketSecondaryTitle.styles";
import { ITicketSecondaryTitleProps } from "./TicketSecondaryTitle.types";

export const TicketSecondaryTitle: FC<ITicketSecondaryTitleProps> = ({
  children,
}: ITicketSecondaryTitleProps) => {
  return <Styles.TicketSecondaryTitle>{children}</Styles.TicketSecondaryTitle>;
};
