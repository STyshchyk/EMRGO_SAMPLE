import { TModalVariants } from "../Modal.types";

export interface IModalDialogProps {
  children?: React.ReactNode;
  width?: number | string;
  title?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  variant?: TModalVariants;
}

export interface IModalDialogStyleProps {
  $width?: number | string;
  $reveal: boolean;
  variant?: TModalVariants;
}
