import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/journals';

export const doFetchInternalTransactions = createAction(actionTypes.JOURNALS_GET_INTERNAL_TRANSACTIONS_REQUESTED);
export const doFetchInternalTransactionsSuccess = createAction(actionTypes.JOURNALS_GET_INTERNAL_TRANSACTIONS_SUCCEEDED);
export const doFetchInternalTransactionsFailure = createAction(actionTypes.JOURNALS_GET_INTERNAL_TRANSACTIONS_FAILED);

export const doUpdateInternalTransactions = createAction(actionTypes.JOURNALS_UPDATE_INTERNAL_TRANSACTION_BY_JOURNAL_ID_REQUESTED);
export const doUpdateInternalTransactionsSuccess = createAction(actionTypes.JOURNALS_UPDATE_INTERNAL_TRANSACTION_BY_JOURNAL_ID_SUCCEEDED);
export const doUpdateInternalTransactionsFailure = createAction(actionTypes.JOURNALS_UPDATE_INTERNAL_TRANSACTION_BY_JOURNAL_ID_FAILED);
