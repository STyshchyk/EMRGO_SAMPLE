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

export const getIssuanceTypeLabel = (type: TIssuanceType) => {
  return issuanceTypeLabels[type];
};

export const getOpportunityStatusLabel = (status: string | undefined) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  return opportunityStatusLabels[status];
};

