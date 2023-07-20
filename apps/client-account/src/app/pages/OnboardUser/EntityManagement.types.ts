import { PropsWithChildren } from "react";

export interface IEntityManagementProps extends PropsWithChildren {
}

export interface IEntityManagementContext {
  isShown: boolean,
  setIsShow: (flag: boolean) => void
}
