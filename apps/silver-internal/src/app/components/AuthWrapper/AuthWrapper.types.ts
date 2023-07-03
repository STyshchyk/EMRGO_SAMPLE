import { PropsWithChildren } from "react";

export interface IAuthWrapperProps extends PropsWithChildren {
  backUrl?: string;
  hideFAQ?: boolean;
}
