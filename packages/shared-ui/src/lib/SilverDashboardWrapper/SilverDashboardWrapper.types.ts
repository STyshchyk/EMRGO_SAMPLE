import { PropsWithChildren, ReactElement } from "react";

import { IUser } from "@emrgo-frontend/types";

export type ISilverDashboardWrapperProps = PropsWithChildren;

export interface ISilverDashboardWrapperContext {
  enableRoleMapping: boolean;
  user?: IUser | null;
  roles?: string[] | null;
  mainRoutes: IModuleConfig[];
  doLogout: () => void;
  currentRole: any;
  footerRoutes: IModuleConfig[];
  setHelpDeskOpen: (flag: boolean) => void;
  isHelpDeskOpen: boolean;
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
  paths: string[] | "";
  disabled?: boolean;
  onClick?: () => void;
}
