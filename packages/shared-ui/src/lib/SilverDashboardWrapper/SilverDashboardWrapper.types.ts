import { PropsWithChildren, ReactElement } from "react";

import { IUser } from "@emrgo-frontend/types";

export interface ISilverDashboardWrapperProps extends PropsWithChildren {
}

export interface ISilverDashboardWrapperContext {

  user?: IUser | null;
  roles?: string[] | null;
  mainRoutes: IModuleConfig[];
  doLogout: () => void;
  currentRole: any;

}


export interface IRoleSelector {
  label: string;
  key: string;
  module: string;
  route: string;
  access: string[];
}

export interface IModuleConfig {
  label: string;
  icon: ReactElement;
  key: string;
  path: string;
  paths: string[];
}
