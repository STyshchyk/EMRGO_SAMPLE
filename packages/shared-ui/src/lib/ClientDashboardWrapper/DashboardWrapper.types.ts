import { PropsWithChildren } from "react";

import { IUser } from "@emrgo-frontend/types";

export type IDashboardWrapperProps = PropsWithChildren

export interface IDashboardWrapperContext {
  numberOfNotifications: number;
  onAcceptPlatformTerms: () => void;
  onRejectPlatformTerms: () => void;
  user: IUser | null;
  showTermsModal: string;
  termsDocumentURL: string;
}
