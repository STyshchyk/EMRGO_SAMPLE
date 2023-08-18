import { PropsWithChildren, ReactElement } from "react";

import { IUser } from "@emrgo-frontend/types";

export type IDashboardWrapperProps = PropsWithChildren;

export interface IDashboardWrapperContext {
  numberOfNotifications: number;
  user?: IUser | null;
  roles?: string[] | null;
  showTermsModal: string;
  termsDocumentURL: string;
  mainRoutes: IModuleConfig[];
  fullName: string;
  currentModule: string;
  currentRole?: IRoleSelector;
  allAccountRoutes: string[];
  navigateToModule: (module: string, path: string) => void;
  changeUserRole: (role: IRoleSelector) => void;
  onAcceptPlatformTerms: () => void;
  onRejectPlatformTerms: () => void;
  onLogOut: () => void;
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
  disabled?: boolean;
}
