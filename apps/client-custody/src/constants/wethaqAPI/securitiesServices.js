export const admissionStatusEnum = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  ADMITTED: "Admitted",
  REJECTED: "Rejected",
};

export const positionTypeEnum = {
  HELD_FREELY: "Held Freely",
};

export const securityTradeSettlementStatusEnum = {
  primaryIssuance: {
    PENDING_SETTLEMENT: "Pending Settlement",
    INITIATE_SETTLEMENT: "Initiate Settlement",
    APPROVED: "Approved",
    SETTLED: "Settled",
    FAILED: "Failed",
  },
};

export const externalSecurityStatusEnum = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const counterpartyStatusEnum = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export const settlementInstructionStatusEnum = {
  ACKNOWLEDGED_ACCEPTED: "Acknowledged Accepted",
  CANCELLED: "Cancelled",
  CANCELLED_REQUESTED: "Cancellation Requested",
  FAILED: "Failed",
  MATCHED: "Matched",
  SETTLED: "Settled",
  UNMATCHED: "Unmatched",
  REJECTED: "Rejected",
  REQUESTED: "Requested",
  APPROVAL_REQUIRED: "Requires Approval",
};

export const couponAllocationStatusEnum = {
  NO_EXPECTED_COUPON: "No Expected Coupon ",
  UNALLOCATED: "Unallocated",
  PENDING_APPROVAL: "Pending Approval",
  ALLOCATED: "Allocated",
};

export const settlementLocationEnum = {
  EUROCLEAR: "Euroclear",
  SIX: "SIX",
  CLEARSTREAM: "Clearstream",
};
