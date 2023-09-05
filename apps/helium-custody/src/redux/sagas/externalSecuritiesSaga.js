import { toast } from "react-toastify";

import { call, debounce, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as externalSecuritiesActionCreators from "../actionCreators/externalSecurities";
import * as externalSecuritiesActionTypes from "../actionTypes/externalSecurities";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchExternalSecuritiesList({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.externalSecuritiesAPI.getExternalSecurities,
      payload
    );
    const { data } = response;
    yield put(externalSecuritiesActionCreators.doFetchExternalSecuritiesListSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(externalSecuritiesActionCreators.doFetchExternalSecuritiesListFailure(errorMessage));
  }
}

function* addExternalSecurties({ payload }) {
  try {
    const { requestPayload, successCallback } = payload;
    const response = yield call(
      wethaqAPIService.externalSecuritiesAPI.addExternalSecurity,
      requestPayload
    );
    const { data } = response;
    yield put(externalSecuritiesActionCreators.doAddExternalSecuritiesSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    if (payload?.rejectCallback) {
      payload?.rejectCallback();
    }    
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(externalSecuritiesActionCreators.doAddExternalSecuritiesFailure(errorMessage));
  }
}

function* editExternalSecurties({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(
      wethaqAPIService.externalSecuritiesAPI.editExternalSecurity,
      requestPayload
    );
    const { data } = response;
    yield put(externalSecuritiesActionCreators.doEditExternalSecuritiesSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(externalSecuritiesActionCreators.doEditExternalSecuritiesFailure(errorMessage));
  }
}

function* deleteExternalSecurties({ payload }) {
  const { requestPayload, successCallback } = payload;

  try {
    const response = yield call(
      wethaqAPIService.externalSecuritiesAPI.deleteExternalSecurity,
      requestPayload
    );
    const { data } = response;
    yield put(externalSecuritiesActionCreators.doDeleteExternalSecuritiesSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(externalSecuritiesActionCreators.doDeleteExternalSecuritiesFailure(errorMessage));
  }
}

function* addEquityExternalSecurity({ payload }) {
  try {
    const { requestPayload } = payload;
    const response = yield call(
      wethaqAPIService.externalSecuritiesAPI.addEquityExternalSecurity,
      requestPayload
    );
    const { data } = response;
    yield put(externalSecuritiesActionCreators.doAddEquityExternalSecuritiesSuccess({ data }));
    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(externalSecuritiesActionCreators.doAddEquityExternalSecuritiesFailure(errorMessage));
  }
}

function* queryExternalSecurities({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.externalSecuritiesAPI.searchExternalSecurities,
      payload
    );
    const { data } = response;
    yield put(externalSecuritiesActionCreators.doSearchExternalSecuritiesSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(externalSecuritiesActionCreators.doSearchExternalSecuritiesFailure(errorMessage));
  }
}

const externalSecuritiesSaga = [
  takeLatest(
    externalSecuritiesActionTypes.EXTERNAL_SECURITIES_LIST_FETCH_REQUESTED,
    fetchExternalSecuritiesList
  ),
  takeLatest(externalSecuritiesActionTypes.EXTERNAL_SECURITIES_ADD_REQUESTED, addExternalSecurties),
  takeLatest(
    externalSecuritiesActionTypes.EXTERNAL_SECURITIES_EDIT_REQUESTED,
    editExternalSecurties
  ),
  takeLatest(
    externalSecuritiesActionTypes.EXTERNAL_SECURITIES_DELETE_REQUESTED,
    deleteExternalSecurties
  ),
  takeLatest(
    externalSecuritiesActionTypes.EXTERNAL_SECURITIES_ADD_EQUITY_REQUESTED,
    addEquityExternalSecurity
  ),
  takeLatest(
    externalSecuritiesActionTypes.EXTERNAL_SECURITIES_SEARCH_REQUESTED,
    queryExternalSecurities
  ),
];

export default externalSecuritiesSaga;
