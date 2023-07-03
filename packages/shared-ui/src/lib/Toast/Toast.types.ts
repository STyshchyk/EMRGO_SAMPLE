import { PropsWithChildren } from "react";
import { ToasterProps } from "react-hot-toast";

export type TToastVariants = "success" | "info" | "error" | "warning";

export interface IToastProps extends PropsWithChildren {
  /** The variant to use */
  variant: TToastVariants;
  /** Callback fired when the component requests to be closed.*/
  onClose?: () => void;
}

export interface IToastProviderProps extends ToasterProps {}
