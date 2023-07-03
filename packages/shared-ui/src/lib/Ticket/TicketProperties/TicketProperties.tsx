import { FC } from "react";

import * as Styles from "./TicketProperties.styles";
import { ITicketPropertiesProps } from "./TicketProperties.types";

export const TicketProperties: FC<ITicketPropertiesProps> = ({
  children,
}: ITicketPropertiesProps) => {
  return <Styles.TicketProperties>{children}</Styles.TicketProperties>;
};
