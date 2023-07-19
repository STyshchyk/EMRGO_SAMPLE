import { PropsWithChildren } from "react";

export interface IOnboardUserProps extends PropsWithChildren {
}

export interface IOnboardUserContext {
  isShown: boolean,
  setIsShow: (flag: boolean) => void
}
