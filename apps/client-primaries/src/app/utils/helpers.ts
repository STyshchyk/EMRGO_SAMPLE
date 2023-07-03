import {
  TIssuanceType,
  TOpportunityStatus,
} from "../components/PrimariesWrapper/PrimariesWrapper.types";

const issuanceTypeLabels: Record<TIssuanceType, string> = {
  bonds: "Bonds",
  certificates: "Certificates",
  "structured-products": "Structured Products",
  sukuk: "Sukuk",
};

const opportunityStatusLabels: Record<TOpportunityStatus, string> = {
  idea: "Idea",
  open: "Open",
  closed: "Closed",
};

export const getIssuanceTypeLabel = (type: TIssuanceType) => {
  return issuanceTypeLabels[type];
};

export const getOpportunityStatusLabel = (status: TOpportunityStatus) => {
  return opportunityStatusLabels[status];
};
