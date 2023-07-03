import { TPendingExecutionStatus } from "../TradeManagement.types";

const pendingExecutionStatusLabels: Record<TPendingExecutionStatus, string> = {
  "in-review": "In review",
  pending: "Pending",
  rejected: "Rejected",
};

export const getPendingExecutionStatusLabel = (status: TPendingExecutionStatus) => {
  return pendingExecutionStatusLabels[status];
};
