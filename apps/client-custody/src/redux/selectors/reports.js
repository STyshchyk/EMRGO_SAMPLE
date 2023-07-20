import { createSelector } from "reselect";

export const selectCashAccountsData = (state) => state.reports.cashAccounts;
export const selectCashTransactionsData = (state) => state.reports.cashTransactions;

export const selectCashAccounts = createSelector([selectCashAccountsData], (accountsData) => {
  if (accountsData) {
    return accountsData.map((account) => {
      const securityAccount = { id: account.id, accountNumber: account.accountNo };
      return {
        ...account,
        group: { ...account.group, entity: { ...account.group.entity, securityAccount } },
      };
    });
  }
  return [];
});

export const selectCashTransactions = createSelector(
  [selectCashTransactionsData],
  (transactionsData) => {
    if (transactionsData) {
      const finalData = [];
      const summaryRows = transactionsData;
      summaryRows.forEach((row) => {
        const { transactions } = row;
        transactions.forEach((tr) => {
          finalData.push(tr);
        });
      });
      return finalData;
    }
    return [];
  }
);

export const selectSecuritiesAccountsData = (state) => state.reports.securitiesAccounts;
export const selectSecuritiesTransactionsData = (state) => state.reports.securitiesTransactions;

export const selectSecuritiesAccounts = createSelector(
  [selectSecuritiesAccountsData],
  (accountsData) => {
    if (accountsData) {
      return accountsData.map((account) => {
        const securityAccount = { id: account.id, accountNumber: account.accountNumber };
        return {
          ...account,
          group: { ...account.group, entity: { ...account.group.entity, securityAccount } },
        };
      });
    }
    return [];
  }
);

export const selectSecuritiesTransactions = createSelector(
  [selectSecuritiesTransactionsData],
  (transactionsData) => {
    // Is used to get a mutable array needed by material table
    if (transactionsData) {
      const finalData = [];
      transactionsData.forEach((transaction) => {
        finalData.push({ ...transaction });
      });
      return finalData;
    }
    return [];
  }
);

export const selectSecuritiesHoldingsData = (state) => state.reports.securitiesHoldings;

export const selectTradeDatedSecuritiesHoldingsData = (state) =>
  state.reports.tradeDatedSecuritiesHoldings;

export const selectCashBalances = (state) => state.reports.cashBalances;

export const selectReferenceData = (state) => state.reports.referenceData;
export const selectIsFetching = (state) => state.reports.isFetching;
export const selectIsFetchingSecuritiesHoldings = (state) =>
  state.reports.isFetchingSecuritiesHoldings;
export const selectIsFetchingTradeDatedSecuritiesHoldings = (state) =>
  state.reports.isFetchingTradeDatedSecuritiesHoldings;

export const selectSecuritiesList = createSelector([selectReferenceData], (referenceData) => {
  if (Array.isArray(referenceData) && referenceData.length > 0) {
    return referenceData.map((item) => ({
      admissionStatus: item.admissionStatus,
      countryOfRisk: item.operatingAddress?.country?.name,
      createdAt: item.createdAt,
      currencyName: item.currencyName,
      denominationName: item.denominationName,
      frequencyName: item.frequencyName,
      id: item.id,
      isin: item.isin,
      issuanceAmount: item.issuanceAmount,
      issuanceName: item.name,
      issueDate: item.issueDate,
      maturityAmount: item.maturityAmount,
      maturityDate: item.maturityDate,
      name: item.name,
      nextCouponDate: item.nextCouponDate,
      pricingName: item.pricingName,
      profitRate: item.profitRate,
      securityLongName: item?.securityLongName,
      securityShortName: item.securityShortName,
      status: item.status,
      sukukTypeName: item.sukukTypeName,
      ticker: item.ticker,
      hybridSukukType: item.hybridSukukType,
      updatedAt: item.updatedAt,
      wsn: item.wsn,
    }));
  }

  return [];
});
