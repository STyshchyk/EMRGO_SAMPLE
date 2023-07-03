import { IIssuance, TOpportunityStatus } from "../Primaries.types";

export type TPendingExecutionStatus = "pending" | "in-review" | "rejected";

export interface ITradeManagementProps {}

export interface ITradeManagementContext {
  watchlist: IWatchlistIssuance[];
  pendingExecution: IPendingExecutionIssuance[];
  executed: IExecutedIssuance[];
  removeFromWatchlist: (id: number) => void;
  viewTicket: (id: number) => void;
  proceed: (id: number) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (isProfileComplete: boolean) => void;
  purchaseTicket?: IPurchaseTicket;
  setPurchaseTicket: (ticket?: IPurchaseTicket) => void;
  rejectPurchaseTicket: (id: number) => void;
  executePurchaseTicket: (id: number) => void;
}

export interface IWatchlistIssuance extends IIssuance {
  sellSide: string;
  status: TOpportunityStatus;
  timeLeft: string;
}

export interface IPendingExecutionIssuance extends IIssuance {
  sellSide: string;
  status: TPendingExecutionStatus;
}

export interface IExecutedIssuance extends IIssuance {
  sellSide: string;
}

export interface IPurchaseTicket {
  id: number;
  name: string;
  security: string;
  isin: string;
  tradeIdentifier: string;
  certificates: number;
  netSettlementAmount: string;
  ssi: string;
  entity: string;
  entityId: string;
  lei: string;
  tradeDate: string;
  settlementDate: string;
}
