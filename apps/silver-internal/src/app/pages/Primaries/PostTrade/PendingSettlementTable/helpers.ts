import { TPendingSettlementStatus } from "../PostTrade.types";

const pendingSettlementStatusLabels: Record<TPendingSettlementStatus, string> = {
  "payment-pending": "Payment pending",
  "payment-received": "Payment received",
  failure: "Failure",
};

export const getPendingSettlementStatusLabel = (status: TPendingSettlementStatus) => {
  return pendingSettlementStatusLabels[status];
};
