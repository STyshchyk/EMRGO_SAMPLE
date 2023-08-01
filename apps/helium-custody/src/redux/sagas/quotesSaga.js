import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as quotesActionCreators from "../actionCreators/quotes";
import * as actionTypes from "../actionTypes/quotes";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* createQuotes({ payload }) {
  try {
    const response = yield call(wethaqAPIService.quotesAPI.createQuote, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(quotesActionCreators.doCreateQuoteSuccess({ data }));
    yield put(quotesActionCreators.doReadQuoteRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(quotesActionCreators.doCreateQuoteFailure(errorMessage));
  }
}

function* readQuotes() {
  try {
    const response = yield call(wethaqAPIService.quotesAPI.readQuote);
    const { data } = response;
    yield put(quotesActionCreators.doReadQuoteSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(quotesActionCreators.doReadQuoteFailure(errorMessage));
  }
}

function* updateQuotes({ payload }) {
  try {
    const response = yield call(wethaqAPIService.quotesAPI.updateQuote, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(quotesActionCreators.doUpdateQuoteSuccess({ data }));
    yield put(quotesActionCreators.doReadQuoteRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(quotesActionCreators.doUpdateQuoteFailure(errorMessage));
  }
}

function* deleteQuotes({ payload }) {
  try {
    const response = yield call(wethaqAPIService.quotesAPI.deleteQuote, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(quotesActionCreators.doDeleteQuoteSuccess({ data }));
    yield put(quotesActionCreators.doReadQuoteRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(quotesActionCreators.doDeleteQuoteFailure(errorMessage));
  }
}

const quotesSaga = [
  takeLatest(actionTypes.CREATE_QUOTE_REQUESTED, createQuotes),
  takeLatest(actionTypes.READ_QUOTE_REQUESTED, readQuotes),
  takeLatest(actionTypes.UPDATE_QUOTE_REQUESTED, updateQuotes),
  takeLatest(actionTypes.DELETE_QUOTE_REQUESTED, deleteQuotes),
];

export default quotesSaga;
