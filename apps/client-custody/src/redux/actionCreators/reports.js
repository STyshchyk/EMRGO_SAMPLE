import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/reports";

export const doFetchCashAccounts = createAction(actionTypes.FETCH_CASH_ACCOUNTS_REQUESTED);
export const doFetchCashAccountsSuccess = createAction(actionTypes.FETCH_CASH_ACCOUNTS_SUCCEEDED);
export const doFetchCashAccountsFailure = createAction(actionTypes.FETCH_CASH_ACCOUNTS_FAILED);

export const doFetchCashTransactions = createAction(actionTypes.FETCH_CASH_TRANSACTIONS_REQUESTED);
export const doFetchCashTransactionsSuccess = createAction(
  actionTypes.FETCH_CASH_TRANSACTIONS_SUCCEEDED
);
export const doFetchCashTransactionsFailure = createAction(
  actionTypes.FETCH_CASH_TRANSACTIONS_FAILED
);

export const doResetCashTransactions = createAction(actionTypes.RESET_CASH_TRANSACTIONS);

export const doFetchCashBalances = createAction(actionTypes.FETCH_CASH_BALANCES_REQUESTED);
export const doFetchCashBalancesSuccess = createAction(actionTypes.FETCH_CASH_BALANCES_SUCCEEDED);
export const doFetchCashBalancesFailure = createAction(actionTypes.FETCH_CASH_BALANCES_FAILED);

export const doResetCashBalances = createAction(actionTypes.RESET_CASH_BALANCES);

export const doFetchSecuritiesAccounts = createAction(
  actionTypes.FETCH_SECURITIES_ACCOUNTS_REQUESTED
);
export const doFetchSecuritiesAccountsSuccess = createAction(
  actionTypes.FETCH_SECURITIES_ACCOUNTS_SUCCEEDED
);
export const doFetchSecuritiesAccountsFailure = createAction(
  actionTypes.FETCH_SECURITIES_ACCOUNTS_FAILED
);

export const doFetchSecuritiesTransactions = createAction(
  actionTypes.FETCH_SECURITIES_TRANSACTIONS_REQUESTED
);
export const doFetchSecuritiesTransactionsSuccess = createAction(
  actionTypes.FETCH_SECURITIES_TRANSACTIONS_SUCCEEDED
);
export const doFetchSecuritiesTransactionsFailure = createAction(
  actionTypes.FETCH_SECURITIES_TRANSACTIONS_FAILED
);

export const doResetSecuritiesTransactions = createAction(
  actionTypes.RESET_SECURITIES_TRANSACTIONS
);

export const doFetchSecuritiesHoldings = createAction(
  actionTypes.FETCH_SECURITIES_HOLDINGS_REQUESTED
);
export const doFetchSecuritiesHoldingsSuccess = createAction(
  actionTypes.FETCH_SECURITIES_HOLDINGS_SUCCEEDED
);
export const doFetchSecuritiesHoldingsFailure = createAction(
  actionTypes.FETCH_SECURITIES_HOLDINGS_FAILED
);

export const doFetchTradeDatedSecuritiesHoldings = createAction(
  actionTypes.FETCH_TRADE_DATED_SECURITIES_HOLDINGS_REQUESTED
);
export const doFetchTradeDatedSecuritiesHoldingsSuccess = createAction(
  actionTypes.FETCH_TRADE_DATED_SECURITIES_HOLDINGS_SUCCEEDED
);
export const doFetchTradeDatedSecuritiesHoldingsFailure = createAction(
  actionTypes.FETCH_TRADE_DATED_SECURITIES_HOLDINGS_FAILED
);

export const doResetSecuritiesHoldings = createAction(actionTypes.RESET_SECURITIES_HOLDINGS);

export const doFetchReferenceData = createAction(actionTypes.FETCH_REFERENCE_DATA_REQUESTED);
export const doFetchReferenceDataSuccess = createAction(actionTypes.FETCH_REFERENCE_DATA_SUCCEEDED);
export const doFetchReferenceDataFailure = createAction(actionTypes.FETCH_REFERENCE_DATA_FAILED);
