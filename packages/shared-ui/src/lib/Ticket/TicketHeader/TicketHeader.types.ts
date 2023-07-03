import { PropsWithChildren } from "react";

export interface ITicketHeaderProps extends PropsWithChildren {
  onClose?: () => void;
}
