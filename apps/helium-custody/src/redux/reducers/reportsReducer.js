import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/reports";

const defaultState = {
  errorMessage: null,
  isFetching: false,
  cashAccounts: null,
  cashTransactions: null,
  cashBalances: null,
  securitiesAccounts: null,
  securitiesTransactions: null,
  securitiesHoldings: null,
  tradeDatedSecuritiesHoldings: null,
  referenceData: null,
  isFetchingSecuritiesHoldings: false,
  isFetchingTradeDatedSecuritiesHoldings: false,
};

const reportsReducer = handleActions(
  {
    [actionCreators.doFetchCashAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchCashAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.cashAccounts = data.data;
    }),
    [actionCreators.doFetchCashAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doFetchCashTransactions]: produce((draft) => {
      draft.errorMessage = null;
      draft.cashTransactions = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchCashTransactionsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.cashTransactions = data.data;
    }),
    [actionCreators.doFetchCashTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doResetCashTransactions]: produce((draft) => {
      draft.cashTransactions = null;
    }),

    [actionCreators.doFetchCashBalances]: produce((draft) => {
      draft.errorMessage = null;
      draft.cashBalances = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchCashBalancesSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.cashBalances = data.data;
    }),
    [actionCreators.doFetchCashBalancesFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doResetCashBalances]: produce((draft) => {
      draft.cashBalances = null;
    }),

    [actionCreators.doFetchSecuritiesAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchSecuritiesAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.securitiesAccounts = data.data;
    }),
    [actionCreators.doFetchSecuritiesAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doFetchSecuritiesTransactions]: produce((draft) => {
      draft.errorMessage = null;
      draft.securitiesTransactions = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchSecuritiesTransactionsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isFetching = false;
        draft.securitiesTransactions = data.data;
      }
    ),
    [actionCreators.doFetchSecuritiesTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doResetSecuritiesTransactions]: produce((draft) => {
      draft.securitiesTransactions = null;
    }),

    [actionCreators.doFetchSecuritiesHoldings]: produce((draft) => {
      draft.errorMessage = null;
      draft.securitiesHoldings = null;
      draft.isFetchingSecuritiesHoldings = true;
    }),
    [actionCreators.doFetchSecuritiesHoldingsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingSecuritiesHoldings = false;
      draft.securitiesHoldings = data.data;
    }),
    [actionCreators.doFetchSecuritiesHoldingsFailure]: produce((draft, { payload }) => {
      draft.isFetchingSecuritiesHoldings = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doFetchTradeDatedSecuritiesHoldings]: produce((draft) => {
      draft.errorMessage = null;
      draft.tradeDatedSecuritiesHoldings = null;
      draft.isFetchingTradeDatedSecuritiesHoldings = true;
    }),
    [actionCreators.doFetchTradeDatedSecuritiesHoldingsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isFetchingTradeDatedSecuritiesHoldings = false;
        draft.tradeDatedSecuritiesHoldings = data.data;
      }
    ),
    [actionCreators.doFetchTradeDatedSecuritiesHoldingsFailure]: produce((draft, { payload }) => {
      draft.isFetchingTradeDatedSecuritiesHoldings = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doResetSecuritiesHoldings]: produce((draft) => {
      draft.securitiesHoldings = null;
    }),

    [actionCreators.doFetchReferenceData]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchReferenceDataSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.referenceData = data.data;
    }),
    [actionCreators.doFetchReferenceDataFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default reportsReducer;
