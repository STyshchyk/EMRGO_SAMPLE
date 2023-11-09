import { createSelector } from "reselect";

export const selectAccountsData = (state) => state.billingAndPayments.accounts;
export const selectTransactionsData = (state) => state.billingAndPayments.transactions;
export const selectIsFetching = (state) => state.billingAndPayments.isFetching;
export const selectIsSubmitting = (state) => state.billingAndPayments.isSubmitting;
export const selectIsRequesting = (state) => state.billingAndPayments.isRequesting;
export const selectSourceOwners = (state) => state.billingAndPayments.sourceOwners;
export const selectDestinationOwners = (state) => state.billingAndPayments.destinationOwners;
export const selectSourceAccounts = (state) => state.billingAndPayments.sourceAccounts;
export const selectDestinationAccounts = (state) => state.billingAndPayments.destinationAccounts;
export const selectFetchingTransfers = (state) => state.billingAndPayments.isFetchingTransfers;
export const selectExternalPaymentsAuditData = (state) =>
  state.billingAndPayments.externalPaymentsAuditData;
export const selectIsFetchingExternalPaymentsAuditData = (state) =>
  state.billingAndPayments.isFetchingExternalPaymentsAuditData;

export const selectAccounts = createSelector([selectAccountsData], (accountsData) => {
  if (accountsData?.data) {
    return accountsData.data
      .map((account, index) => {
        const securityAccount = account.group.entity.securityAccount || {
          id: `89de871a-76ae-4b23-9679-c3c18448310${index}`,
          accountNumber: `1122334455-${index}`,
        };
        return {
          ...account,
          group: { ...account.group, entity: { ...account.group.entity, securityAccount } },
        };
      })
      .filter((account) => account.isActive && account.portfolio.status === "Active");
  }
  return [];
});

export const selectTransactions = createSelector([selectTransactionsData], (transactionsData) => {
  if (transactionsData?.data) {
    const finalData = [];
    const summaryRows = transactionsData.data;
    summaryRows &&
      summaryRows.forEach((row) => {
        const { transactions } = row;
        transactions &&
          transactions.forEach((tr) => {
            finalData.push(tr);
          });
      });
    return finalData;
  }
  return [];
});

export const selectDropDowns = (state) => state.billingAndPayments.dropdowns;
export const selectUnallocatedTransactions = (state) =>
  state.billingAndPayments.unallocatedTransfers;

export const selectWethaqAccounts = createSelector([selectAccountsData], (accountsData) => {
  if (accountsData?.data && Array.isArray(accountsData?.data)) {
    const { data } = accountsData;

    return data.map(({ id, accountNo, accountBalance, type, currency, isActive }) => ({
      id,
      accountNo,
      accountBalance,
      type,
      currencyName: currency.name,
      isActive,
    }));
  }

  return [];
});

export const selectWethaqOwnedAccounts = createSelector(
  [selectWethaqAccounts],
  (wethaqAccounts) => {
    const ACCOUNT_TYPES = [
      "SUSPENSE",
      "CLIENT_BALANCE_CONTROL",
      "UNALLOCATED_CLIENT_ACCOUNT",
      "CUSTODY_WASH_ACCOUNT",
      "WETHAQ_CMA",
      "WETHAQ_CLIENT_FEES",
    ];

    if (wethaqAccounts && Array.isArray(wethaqAccounts)) {
      return wethaqAccounts.filter(({ type }) => ACCOUNT_TYPES.includes(type));
    }

    return [];
  }
);

export const selectExternalPaymentsAuditHistoryDataList = createSelector(
  [selectExternalPaymentsAuditData],
  (externalPaymentsAuditData) => {
    const externalPaymentAudit = externalPaymentsAuditData?.auditLog;

    if (Array.isArray(externalPaymentAudit) && externalPaymentAudit.length) {
      return externalPaymentAudit.map((item) => ({
        id: item.id,
        auditSubType: item.auditSubType,
        auditTimestamp: item.auditTimestamp,
        auditType: item.auditType,
        auditColumnLabel: item.auditColumnLabel,
        newStatus: item.newStatus,
        prevStatus: item.prevStatus,
        reason: item.reason,
        paymentInstructionsId: item.paymentInstructionsId,
        user: item.user,
      }));
    }

    return [];
  }
);
