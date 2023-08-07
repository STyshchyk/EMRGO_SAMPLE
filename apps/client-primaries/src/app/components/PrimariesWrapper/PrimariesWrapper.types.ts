import { PropsWithChildren } from "react";

import { IUser } from "@emrgo-frontend/types";

export interface IPrimariesWrapperProps extends PropsWithChildren {}

export interface IPrimariesWrapperContext {
  numberOfNewTradeOpportunities: number;
  numberOfNotifications: number;

  user: IUser | null;


  onAcceptClientTerms: () => void;
  onRejectClientTerms: () => void;

  showTermsModal: string;
  termsDocumentURL: string;
}

export type TIssuanceType = "sukuk" | "bonds" | "structured-products" | "certificates";
export type TOpportunityStatus = "idea" | "open" | "closed";

export interface IIssuance {
  id: number;
  issuer: string;
  type: TIssuanceType;
  currency: string;
  amount: string;
  return: string;
  tenor: string;
  isin: string;
}
