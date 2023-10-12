import { createSelector } from "reselect";

export const selectCashAccountsData = (state) => state.reports.cashAccounts;
export const selectCashTransactionsData = (state) => state.reports.cashTransactions;
const rowData = [
  {
    id: "fc8177cb-8799-41e9-9356-83a9c34ded6211",
    accountBalance: "0",
    accountNo: "Q15000002",
    createdAt: "2023-09-29T10:25:34.862743Z",
    currencyId: "adf0c0fd-86c2-45ed-8cdf-f48048b0340d",
    entityGroupId: "00000000-0000-0000-0000-000000000000",
    iban: null,
    isActive: true,
    isArchived: false,
    isVirtualIBAN: false,
    lastStatementFetchDate: null,
    type: "INVESTOR",
    updatedAt: "2023-09-29T10:25:34.862743Z",
    currency: {
      id: "adf0c0fd-86c2-45ed-8cdf-f48048b0340d",
      name: "GBP",
      type: "currency",
      label: "Pound Sterling",
      key: null,
    },
    group: {
      id: "00000000-0000-0000-0000-000000000000",
      entityId: "00000000-0000-0000-0000-000000000000",
      name: null,
      entityType: null,
      entity: {
        id: "c7121ee3-1872-4e1e-acc4-71da9f8471cc",
        corporateEntityName: "tPavlLtd",
        kycId: "00000000-0000-0000-0000-000000000000",
      },
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        firstName: null,
        lastName: null,
        email: null,
      },
      clientSecuritiesAccount: {
        id: "1175764779-66b6-4de0-885a-01bb13544b4c",
        accountNumber: "Q0000002",
        accountBalance: "5099",
        type: "SECURITY_ACCOUNT",
        isDeleted: false,
        entityGroupId: null,
      },
      addresses: [],
    },
  },
  {
    id: "0fb761e4-97f5-4dcc-98c2-4b5a27ed805211",
    accountBalance: "0",
    accountNo: "Q16000002",
    createdAt: "2023-09-29T10:25:34.862743Z",
    currencyId: "47197049-cbcf-498a-aa09-84164ecd2918",
    entityGroupId: "00000000-0000-0000-0000-000000000000",
    iban: null,
    isActive: true,
    isArchived: false,
    isVirtualIBAN: false,
    lastStatementFetchDate: null,
    type: "INVESTOR",
    updatedAt: "2023-09-29T10:25:34.862743Z",
    currency: {
      id: "47197049-cbcf-498a-aa09-84164ecd2918",
      name: "EUR",
      type: "currency",
      label: "Euro",
      key: null,
    },
    group: {
      id: "00000000-0000-0000-0000-000000000000",
      entityId: "00000000-0000-0000-0000-000000000000",
      name: null,
      entityType: null,
      entity: {
        id: "c7121ee3-1872-4e1e-acc4-71da9f8471cc",
        corporateEntityName: "tPavlLtd",
        kycId: "00000000-0000-0000-0000-000000000000",
      },
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        firstName: null,
        lastName: null,
        email: null,
      },
      clientSecuritiesAccount: {
        id: "1175764779-66b6-4de0-885a-01bb13544b4c",
        accountNumber: "Q0000002",
        accountBalance: "5099",
        type: "SECURITY_ACCOUNT",
        isDeleted: false,
        entityGroupId: null,
      },
      addresses: [],
    },
  },
  {
    id: "6b3595b8-69f9-49b5-97c0-286150f920e11f",
    accountBalance: "-109",
    accountNo: "Q102300002",
    createdAt: "2023-09-29T10:25:34.862743Z",
    currencyId: "436e5a37-8655-432c-88b9-7c78028d68a4",
    entityGroupId: "00000000-0000-0000-0000-000000000000",
    iban: null,
    isActive: true,
    isArchived: false,
    isVirtualIBAN: false,
    lastStatementFetchDate: null,
    type: "INVESTOR",
    updatedAt: "2023-09-29T10:25:34.862743Z",
    currency: {
      id: "436e5a37-8655-432c-88b9-7c78028d68a4",
      name: "AED",
      type: "currency",
      label: "UAE Dirham",
      key: null,
    },
    group: {
      id: "00000000-0000-0000-0000-000000000000",
      entityId: "00000000-0000-0000-0000-000000000000",
      name: null,
      entityType: null,
      entity: {
        id: "c7121ee3-1872-4e1e-acc4-71da9f8471cc",
        corporateEntityName: "tPavlLtd",
        kycId: "00000000-0000-0000-0000-000000000000",
      },
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        firstName: null,
        lastName: null,
        email: null,
      },
      clientSecuritiesAccount: {
        id: "1175764779-66b6-4de0-885a-01bb13544b4c",
        accountNumber: "q0000002",
        accountBalance: "5099",
        type: "SECURITY_ACCOUNT",
        isDeleted: false,
        entityGroupId: null,
      },
      addresses: [],
    },
  },
  {
    id: "e813d9cc-e0b5-4b94-ac39-6e7b1f5a58511f",
    accountBalance: "200",
    accountNo: "Q300002302",
    createdAt: "2023-09-29T10:25:34.862743Z",
    currencyId: "fc14e636-5738-4179-bc42-e9684f1495f1",
    entityGroupId: "00000000-0000-0000-0000-000000000000",
    iban: null,
    isActive: true,
    isArchived: false,
    isVirtualIBAN: false,
    lastStatementFetchDate: null,
    type: "INVESTOR",
    updatedAt: "2023-10-09T16:56:44.549662Z",
    currency: {
      id: "fc14e636-5738-4179-bc42-e9684f1495f1",
      name: "SAR",
      type: "currency",
      label: "Saudi Riyal",
      key: null,
    },
    group: {
      id: "00000000-0000-0000-0000-000000000000",
      entityId: "00000000-0000-0000-0000-000000000000",
      name: null,
      entityType: null,
      entity: {
        id: "c7121ee3-1872-4e1e-acc4-71da9f8471cc",
        corporateEntityName: "tPavlLtd",
        kycId: "00000000-0000-0000-0000-000000000000",
      },
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        firstName: null,
        lastName: null,
        email: null,
      },
      clientSecuritiesAccount: {
        id: "1175764779-66b6-4de0-885a-01bb13544b4c",
        accountNumber: "Q0000002",
        accountBalance: "5099",
        type: "SECURITY_ACCOUNT",
        isDeleted: false,
        entityGroupId: null,
      },
      addresses: [],
    },
  },
  {
    id: "6e2096fa-9caa-4773-b835-d2569e58089f11",
    accountBalance: "66550",
    accountNo: "Q1000002",
    createdAt: "2023-09-29T10:25:34.862743Z",
    currencyId: "76dffa69-a8d9-41e6-aa43-c940d57083a5",
    entityGroupId: "00000000-0000-0000-0000-000000000000",
    iban: null,
    isActive: true,
    isArchived: false,
    isVirtualIBAN: false,
    lastStatementFetchDate: null,
    type: "INVESTOR",
    updatedAt: "2023-09-29T10:25:34.862743Z",
    currency: {
      id: "76dffa69-a8d9-41e6-aa43-c940d57083a5",
      name: "USD",
      type: "currency",
      label: "US Dollar",
      key: null,
    },
    group: {
      id: "00000000-0000-0000-0000-000000000000",
      entityId: "00000000-0000-0000-0000-000000000000",
      name: null,
      entityType: null,
      entity: {
        id: "c7121ee3-1872-4e1e-acc4-71da9f8471cc",
        corporateEntityName: "tPavlLtd",
        kycId: "00000000-0000-0000-0000-000000000000",
      },
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        firstName: null,
        lastName: null,
        email: null,
      },
      clientSecuritiesAccount: {
        id: "1175764779-66b6-4de0-885a-01bb13544b4c",
        accountNumber: "Q0000002",
        accountBalance: "5099",
        type: "SECURITY_ACCOUNT",
        isDeleted: false,
        entityGroupId: null,
      },
      addresses: [],
    },
  },
];
export const selectCashAccounts = createSelector([selectCashAccountsData], (accountsData) => {
  if (accountsData) {
    return [].concat(
      accountsData.map((account) => {
        const securityAccount = { id: account.id, accountNumber: account.accountNo };
        return {
          ...account,
          group: { ...account.group, entity: { ...account.group.entity, securityAccount } },
        };
      }),
      rowData
    );
  }
  return [];
});

export const selectCashTransactions = createSelector(
  [selectCashTransactionsData],
  (transactionsData) => {
    if (transactionsData) {
      const finalData = [];
      const summaryRows = transactionsData;
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
