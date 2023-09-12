import { PropsWithChildren } from "react";

export interface IDraggableColumnWrapperProps extends PropsWithChildren {
  snapshot: any;
  checkEmpty?: boolean;
}
export interface IDraggableColumnItemProps extends PropsWithChildren {
  snapshot: any;
  isDisplayed: boolean;
}
