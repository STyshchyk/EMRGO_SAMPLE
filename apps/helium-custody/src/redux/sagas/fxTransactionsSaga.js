import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as fxTransactionsActionCreators from "../actionCreators/fxTransactions";
import * as fxTransactionsActionTypes from "../actionTypes/fxTransactions";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchFxTransactionsList({ payload }) {
  try {
    const response = yield call(wethaqAPIService.fxTransactionsAPI.getFxTransactions, payload);
    const { data } = response;
    yield put(fxTransactionsActionCreators.doFetchFxTransactionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(fxTransactionsActionCreators.doFetchFxTransactionsFailure(errorMessage));
  }
}

function* addFxTransactions({ payload }) {
  try {
    const { requestPayload, dateRange, successCallback } = payload;
    const response = yield call(
      wethaqAPIService.fxTransactionsAPI.addFxTransaction,
      requestPayload
    );
    const { data } = response;
    if (requestPayload.transactionId) {
      yield put(fxTransactionsActionCreators.doAddFxTransactionsSuccess({ data }));
      yield put(fxTransactionsActionCreators.doFetchFxTransactions(dateRange));
      yield call(toast.success, data.message);
    } else {
      yield put(fxTransactionsActionCreators.doFetchFxTransactions(dateRange));
      yield call(toast.success, "Successfully Added Transaction");
    }
    if (successCallback && data) {
      successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(fxTransactionsActionCreators.doAddFxTransactionsFailure(errorMessage));
  }
}

function* processFxTransactions({ payload }) {
  try {
    const { transactionId, requestPayload, dateRange, successCallback } = payload;
    const response = yield call(wethaqAPIService.fxTransactionsAPI.processFxTransaction, {
      transactionId,
      requestPayload,
    });
    const { data } = response;
    yield put(fxTransactionsActionCreators.doProcessFxTransactionsSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield put(fxTransactionsActionCreators.doFetchFxTransactions(dateRange));
    yield call(toast.success, data.message);
  } catch (error) {
    const {errorCallback } = payload;
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    if (errorCallback) {
      errorCallback();
    }
    yield put(fxTransactionsActionCreators.doProcessFxTransactionsFailure(errorMessage));
  }
}

const fxTransactionsSaga = [
  takeLatest(fxTransactionsActionTypes.FX_TRANSACTIONS_FETCH_REQUESTED, fetchFxTransactionsList),
  takeLatest(fxTransactionsActionTypes.FX_TRANSACTIONS_ADD_REQUESTED, addFxTransactions),
  takeLatest(fxTransactionsActionTypes.FX_TRANSACTIONS_PROCESS_REQUESTED, processFxTransactions),
];

export default fxTransactionsSaga;
