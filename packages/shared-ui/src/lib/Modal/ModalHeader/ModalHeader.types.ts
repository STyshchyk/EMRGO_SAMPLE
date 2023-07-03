import { PropsWithChildren } from "react";

export interface IModalHeaderProps extends PropsWithChildren {
  onClose?: () => void;
}
