import { createSelector } from 'reselect';

export const selectPaymentDetails = (state) => state.paymentAndSettlement?.details ?? [];
export const selectPaymentDetailsLoading = (state) => state.paymentAndSettlement.isLoading;
export const selectBlotters = (state) => state.paymentAndSettlement.blotterList;
export const selectBlotterDropdowns = (state) => state.paymentAndSettlement.dropDowns;
export const selectBlotterFirstLoadFlag = (state) => state.paymentAndSettlement.firstLoadFlag;
export const selectIsRequesting = (state) => state.paymentAndSettlement.isRequesting;
export const selectPaymentsList = (state) => state.paymentAndSettlement.paymentsList;
export const selectIsFetching = (state) => state.paymentAndSettlement.isFetching;
export const selectIsSubmitting = (state) => state.paymentAndSettlement.isSubmitting;
export const selectIsFetchingPaymentsList = (state) => state.paymentAndSettlement.isFetchingPaymentsList;
export const selectSettlementInstructionData = (state) => state.paymentAndSettlement.settlementInstructionData;
export const selectIsFetchingSettlementInstructionAuditData = (state) => state.paymentAndSettlement.isFetchingSettlementInstructionAuditData;

export const selectSettlementInstructionAuditHistoryDataList = createSelector([selectSettlementInstructionData], (settlementInstructionData) => {
  const settlementInstructionsAudit = settlementInstructionData?.SettlementAdminInstructionsAudit;

  if (Array.isArray(settlementInstructionsAudit) && settlementInstructionsAudit.length) {
    return settlementInstructionsAudit.map((item) => ({
      id: item.id,
      auditColumnLabel: item.auditColumnLabel,
      auditSubType: item.auditSubType,
      auditTimestamp: item.auditTimestamp,
      auditTrxId: item.auditTrxId,
      auditType: item.auditType,
      newStatus: item.newStatus,
      prevStatus: item.prevStatus,
      reason: item.reason,
      settlementAdminInstructionsId: item.settlementAdminInstructionsId,
      user: item.user,
    }));
  }

  return [];
});
