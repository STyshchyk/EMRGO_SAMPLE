import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import * as journalsActionCreators from '../actionCreators/journals';
import * as journalsActionTypes from '../actionTypes/journals';
import * as wethaqAPIService from '../../services/wethaqAPIService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchInternalTransactions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.journalsAPI.getInternalTransactions, payload);
    const { data } = response;
    yield put(journalsActionCreators.doFetchInternalTransactionsSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(journalsActionCreators.doFetchInternalTransactionsFailure(errorMessage));
  }
}

function* updateInternalTransactionByJournalId({ payload }) {
  try {
    const response = yield call(wethaqAPIService.journalsAPI.updateInternalTransactionByJournalId, payload);
    const { data } = response;
    yield put(journalsActionCreators.doUpdateInternalTransactionsSuccess({ data }));

    if (typeof payload?.successCallback === 'function') {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(journalsActionCreators.doUpdateInternalTransactionsFailure(errorMessage));
  }
}

const journalsSaga = [
  takeLatest(journalsActionTypes.JOURNALS_GET_INTERNAL_TRANSACTIONS_REQUESTED, fetchInternalTransactions),
  takeLatest(journalsActionTypes.JOURNALS_UPDATE_INTERNAL_TRANSACTION_BY_JOURNAL_ID_REQUESTED, updateInternalTransactionByJournalId),
];

export default journalsSaga;
