import { createSelector } from 'reselect';

export const selectFxTransactionsData = (state) => state.fxTransactions.fxTransactionsData;

export const selectIsFetching = (state) => state.fxTransactions.isFetching;
export const selectIsRequesting = (state) => state.fxTransactions.isRequesting;

export const getFxTransactionsList = createSelector([selectFxTransactionsData], (fxData) => {
  if (Array.isArray(fxData.result) && fxData.result.length > 0) {
    return fxData.result?.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      reference: item.reference,
      status: item.status,
      entity: item.fromAccount.group.entity.corporateEntityName,
      fromAmount: item.fromAmount,
      // TODO: to resolve case for currency.nameAr - translations
      fromCurrency: item.fromAccount.currency.name,
      fromAccount: item.fromAccount.accountNo,
      bankRate: item.bankRate,
      markupRate: item.markupRate,
      clientRate: item.clientRate,
      bankAmount: item.bankAmount,
      markupAmount: item.markupAmount,
      clientAmount: item.clientAmount,
      // TODO: to resolve case for currency.nameAr - translations
      toCurrency: item.toAccount.currency.name,
      toAccount: item.toAccount.accountNo,
      narrative: item?.narrative,
    }));
  }

  return [];
});
