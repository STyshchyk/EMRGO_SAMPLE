import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/fxTransactions";

export const doFetchFxTransactions = createAction(actionTypes.FX_TRANSACTIONS_FETCH_REQUESTED);
export const doFetchFxTransactionsSuccess = createAction(
  actionTypes.FX_TRANSACTIONS_FETCH_SUCCEEDED
);
export const doFetchFxTransactionsFailure = createAction(actionTypes.FX_TRANSACTIONS_FETCH_FAILED);

export const doAddFxTransactions = createAction(actionTypes.FX_TRANSACTIONS_ADD_REQUESTED);
export const doAddFxTransactionsSuccess = createAction(actionTypes.FX_TRANSACTIONS_ADD_SUCCEEDED);
export const doAddFxTransactionsFailure = createAction(actionTypes.FX_TRANSACTIONS_ADD_FAILED);

export const doProcessFxTransactions = createAction(actionTypes.FX_TRANSACTIONS_PROCESS_REQUESTED);
export const doProcessFxTransactionsSuccess = createAction(
  actionTypes.FX_TRANSACTIONS_PROCESS_SUCCEEDED
);
export const doProcessFxTransactionsFailure = createAction(
  actionTypes.FX_TRANSACTIONS_PROCESS_FAILED
);
