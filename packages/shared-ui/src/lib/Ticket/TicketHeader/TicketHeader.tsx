import { FC } from "react";

import { CloseIcon } from "../../Icons";
import * as Styles from "./TicketHeader.styles";
import { ITicketHeaderProps } from "./TicketHeader.types";

export const TicketHeader: FC<ITicketHeaderProps> = ({ children, onClose }: ITicketHeaderProps) => {
  return (
    <Styles.TicketHeader>
      {children}

      <Styles.CloseButton onClick={onClose}>
        <CloseIcon />
      </Styles.CloseButton>
    </Styles.TicketHeader>
  );
};
