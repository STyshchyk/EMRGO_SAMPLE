import { FC } from "react";

import * as Styles from "./TicketAction.styles";
import { ITicketActionProps } from "./TicketAction.types";

export const TicketAction: FC<ITicketActionProps> = ({
  children,
  ...buttonProps
}: ITicketActionProps) => {
  return <Styles.TicketAction {...buttonProps}>{children}</Styles.TicketAction>;
};
