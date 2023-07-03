import { PropsWithChildren } from "react";

export interface IDashboardWrapperProps extends PropsWithChildren {}

export interface IDashboardWrapperContext {
  numberOfNotifications: number;
}
