import { PropsWithChildren } from "react";

export interface IPrimariesWrapperProps extends PropsWithChildren {}

export interface IPrimariesWrapperContext {
  numberOfNewTradeOpportunities: number;
  numberOfNotifications: number;
  showClientTermsModal: boolean;
  clientTermsDocumentURL: string;
  onAcceptTerms: () => void;
  onDownloadTerms: () => void;
  onPrintTerms: () => void;
  onShareTerms: () => void;
  onRejectTerms: () => void;
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
