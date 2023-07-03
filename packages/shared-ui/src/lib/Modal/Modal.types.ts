import { PropsWithChildren } from "react";

export type TModalVariants = "default" | "darkened";

export interface IModalProps extends PropsWithChildren {
  isOpen?: boolean;
  onClose?: () => void;
  width?: number | string;
  title?: string;
  showCloseButton?: boolean;
  shaded?: boolean;
  variant?: TModalVariants;
}
