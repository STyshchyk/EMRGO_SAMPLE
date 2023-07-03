import { PropsWithChildren } from "react";

export interface IDrawerProps extends PropsWithChildren {
  /**	If true, the component is shown. */
  isOpen: boolean;
}
