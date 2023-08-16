import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/paymentAndSettlement";

export const doFetchDetailsRequest = createAction(actionTypes.PAYMENT_DETAILS_REQUESTED);
export const doFetchDetailsSuccess = createAction(actionTypes.PAYMENT_DETAILS_SUCCEEDED);
export const doFetchDetailsFailure = createAction(actionTypes.PAYMENT_DETAILS_FAILED);

export const doDropdownReadRequest = createAction(actionTypes.READ_DROPDOWN_REQUESTED);
export const doDropdownReadSuccess = createAction(actionTypes.READ_DROPDOWN_SUCCEEDED);
export const doDropdownReadFailure = createAction(actionTypes.READ_DROPDOWN_FAILED);

export const doTradeSettlementRequest = createAction(actionTypes.TRADE_SETTLEMENT_REQUESTED);
export const doTradeSettlementSuccess = createAction(actionTypes.TRADE_SETTLEMENT_SUCCEEDED);
export const doTradeSettlementFailure = createAction(actionTypes.TRADE_SETTLEMENT_FAILED);

export const doUpdateClientAccountRequest = createAction(
  actionTypes.CLIENT_ACCOUNT_UPDATE_REQUESTED
);
export const doUpdateClientAccountSuccess = createAction(
  actionTypes.CLIENT_ACCOUNT_UPDATE_SUCCEEDED
);
export const doUpdateClientAccountFailure = createAction(actionTypes.CLIENT_ACCOUNT_UPDATE_FAILED);

export const doTradeApprovalRequest = createAction(actionTypes.TRADE_APPROVAL_REQUESTED);
export const doTradeApprovalSuccess = createAction(actionTypes.TRADE_APPROVAL_SUCCEEDED);
export const doTradeApprovalFailure = createAction(actionTypes.TRADE_APPROVAL_FAILED);

export const doRaiseSettlementInstruction = createAction(
  actionTypes.RAISE_SETTLEMENT_INSTRUCTION_REQUESTED
);
export const doRaiseSettlementInstructionSuccess = createAction(
  actionTypes.RAISE_SETTLEMENT_INSTRUCTION_SUCCEEDED
);
export const doRaiseSettlementInstructionFailure = createAction(
  actionTypes.RAISE_SETTLEMENT_INSTRUCTION_FAILED
);

export const doRaiseBulkSettlementInstructions = createAction(
  actionTypes.RAISE_BULK_SETTLEMENT_INSTRUCTIONS_REQUESTED
);
export const doRaiseBulkSettlementInstructionsSuccess = createAction(
  actionTypes.RAISE_BULK_SETTLEMENT_INSTRUCTIONS_SUCCEEDED
);
export const doRaiseBulkSettlementInstructionsFailure = createAction(
  actionTypes.RAISE_BULK_SETTLEMENT_INSTRUCTIONS_FAILED
);

export const doUpdateSettlementInstruction = createAction(
  actionTypes.UPDATE_SETTLEMENT_INSTRUCTION_REQUESTED
);
export const doUpdateSettlementInstructionSuccess = createAction(
  actionTypes.UPDATE_SETTLEMENT_INSTRUCTION_SUCCEEDED
);
export const doUpdateSettlementInstructionFailure = createAction(
  actionTypes.UPDATE_SETTLEMENT_INSTRUCTION_FAILED
);

export const doDeleteSettlementInstruction = createAction(
  actionTypes.DELETE_SETTLEMENT_INSTRUCTION_REQUESTED
);
export const doDeleteSettlementInstructionSuccess = createAction(
  actionTypes.DELETE_SETTLEMENT_INSTRUCTION_SUCCEEDED
);
export const doDeleteSettlementInstructionFailure = createAction(
  actionTypes.DELETE_SETTLEMENT_INSTRUCTION_FAILED
);

export const doSettleSettlementInstruction = createAction(
  actionTypes.SETTLE_SETTLEMENT_INSTRUCTION_REQUESTED
);
export const doSettleSettlementInstructionSuccess = createAction(
  actionTypes.SETTLE_SETTLEMENT_INSTRUCTION_SUCCEEDED
);
export const doSettleSettlementInstructionFailure = createAction(
  actionTypes.SETTLE_SETTLEMENT_INSTRUCTION_FAILED
);

export const doChangeSettlementInstructionChange = createAction(
  actionTypes.CHANGE_SETTLEMENT_INSTRUCTION_STATUS_REQUESTED
);
export const doChangeSettlementInstructionChangeSuccess = createAction(
  actionTypes.CHANGE_SETTLEMENT_INSTRUCTION_STATUS_SUCCEEDED
);
export const doChangeSettlementInstructionChangeFailure = createAction(
  actionTypes.CHANGE_SETTLEMENT_INSTRUCTION_STATUS_FAILED
);

export const doFetchPaymentsList = createAction(actionTypes.FETCH_PAYMENTS_LIST_REQUESTED);
export const doFetchPaymentsListSuccess = createAction(actionTypes.FETCH_PAYMENTS_LIST_SUCCEEDED);
export const doFetchPaymentsListFailure = createAction(actionTypes.FETCH_PAYMENTS_LIST_FAILED);

export const doFetchSettlementInstructionAuditData = createAction(
  actionTypes.FETCH_SETTLEMENT_INSTRUCTION_AUDIT_DATA_REQUESTED
);
export const doFetchSettlementInstructionAuditDataSuccess = createAction(
  actionTypes.FETCH_SETTLEMENT_INSTRUCTION_AUDIT_DATA_SUCCEEDED
);
export const doFetchSettlementInstructionAuditDataFailure = createAction(
  actionTypes.FETCH_SETTLEMENT_INSTRUCTION_AUDIT_DATA_FAILED
);

export const doResetSettlementInstructionAuditData = createAction(
  actionTypes.RESET_SETTLEMENT_INSTRUCTION_AUDIT_DATA_REQUESTED
);
