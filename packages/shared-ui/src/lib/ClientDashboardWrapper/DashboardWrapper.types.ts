import { PropsWithChildren, ReactElement } from "react";

export interface IDashboardWrapperProps extends PropsWithChildren {}

export interface IDashboardWrapperContext {
  numberOfNotifications: number;

  mainRoutes: IModuleConfig[];
  fullName: string;
  currentModule: string;
  currentRole?: IRoleSelector;
  allAccountRoutes: string[];
  navigateToModule: (module: string, path: string) => void;
  changeUserRole: (role: IRoleSelector) => void;
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
