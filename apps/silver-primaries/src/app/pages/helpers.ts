import { TIssuanceType, TOpportunityStatus } from "./Primaries.types";
import { opStatus } from "./TradeOpportunities/AddOpportunityModal/AddOpportunity.types";

const issuanceTypeLabels: Record<TIssuanceType, string> = {
  bonds: "Bonds",
  certificates: "Certificates",
  "structured-products": "Structured Products",
  sukuk: "Sukuk"
};

const opportunityStatusLabels: Record<TOpportunityStatus, string> = {
  [opStatus.open]: "Open",
  [opStatus.idea]: "Idea",
  [opStatus.closed]: "Closed"
};



export type TExecutedStatus =
  "trade_notification"
  | "pending_sellside"
  | "pending_buyside"
  | "pending_buyside"
  | "rejected"
  | "executed";

const executedStatusLabels: Record<TExecutedStatus, string> = {
  trade_notification: "Trade Notification",
  pending_sellside: "Pending Sell-side",
  pending_buyside: "Pending Buy-Side",
  rejected: "Rejected",
  executed: "Executed"
};

export const getOpportunityStatusLabel = (status: string | undefined) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return opportunityStatusLabels[status];
};

export const getIssuanceTypeLabel = (type: TIssuanceType) => {
  return issuanceTypeLabels[type];
};
export const getExecutedStatusLabel = (type: TExecutedStatus) => {
  return executedStatusLabels[type];
};
