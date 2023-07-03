import { opStatus } from "./TradeOpportunities/AddOpportunityModal/AddOpportunity.types";

export interface IPrimariesProps {
}

export interface IPrimariesContext {
  numberOfNewTradeOpportunities: number;
}

export type TIssuanceType = "sukuk" | "bonds" | "structured-products" | "certificates";
export type TOpportunityStatus =
  opStatus.idea
  | opStatus.open
  | opStatus.closed;

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
