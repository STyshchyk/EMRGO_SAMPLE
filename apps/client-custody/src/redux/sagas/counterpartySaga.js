import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as counterpartyActionCreators from "../actionCreators/counterparty";
import * as counterpartyActionTypes from "../actionTypes/counterparty";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchCounterpartyList() {
  try {
    const response = yield call(wethaqAPIService.counterpartyAPI.getCounterpartyList);
    const { data } = response;
    yield put(counterpartyActionCreators.doFetchCounterpartyListSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doFetchCounterpartyListFailure(errorMessage));
  }
}

function* addCounterparty({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(wethaqAPIService.counterpartyAPI.addCounterparty, requestPayload);
    const { data } = response;
    yield put(counterpartyActionCreators.doAddCounterpartySuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doAddCounterpartyFailure(errorMessage));
  }
}

function* editCounterparty({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(wethaqAPIService.counterpartyAPI.editCounterparty, requestPayload);
    const { data } = response;
    yield put(counterpartyActionCreators.doEditCounterpartySuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doEditCounterpartyFailure(errorMessage));
  }
}

function* deleteCounterparty({ payload }) {
  const { requestPayload, successCallback } = payload;

  try {
    const response = yield call(
      wethaqAPIService.counterpartyAPI.deleteCounterparty,
      requestPayload
    );
    const { data } = response;
    yield put(counterpartyActionCreators.doDeleteCounterpartySuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doDeleteCounterpartyFailure(errorMessage));
  }
}

function* fetchDropdowns({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(counterpartyActionCreators.doFetchDropdownsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(counterpartyActionCreators.doFetchDropdownsFailure(errorMessage));
  }
}

function* fetchCounterpartySSIList() {
  try {
    const response = yield call(wethaqAPIService.counterpartyAPI.getCounterpartySSIList);
    const { data } = response;
    yield put(counterpartyActionCreators.doFetchCounterpartySSIListSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doFetchCounterpartySSIListFailure(errorMessage));
  }
}

function* addCounterpartySSI({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(
      wethaqAPIService.counterpartyAPI.addCounterpartySSI,
      requestPayload
    );
    const { data } = response;
    yield put(counterpartyActionCreators.doAddCounterpartySSISuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doAddCounterpartySSIFailure(errorMessage));
  }
}

function* editCounterpartySSI({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(
      wethaqAPIService.counterpartyAPI.editCounterpartySSI,
      requestPayload
    );
    const { data } = response;
    yield put(counterpartyActionCreators.doEditCounterpartySSISuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doEditCounterpartySSIFailure(errorMessage));
  }
}

function* deleteCounterpartySSI({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(
      wethaqAPIService.counterpartyAPI.deleteCounterpartySSI,
      requestPayload
    );
    const { data } = response;
    yield put(counterpartyActionCreators.doDeleteCounterpartySSISuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(counterpartyActionCreators.doDeleteCounterpartySSIFailure(errorMessage));
  }
}

const counterpartySaga = [
  takeLatest(counterpartyActionTypes.COUNTERPARTY_LIST_FETCH_REQUESTED, fetchCounterpartyList),
  takeLatest(counterpartyActionTypes.COUNTERPARTY_ADD_REQUESTED, addCounterparty),
  takeLatest(counterpartyActionTypes.COUNTERPARTY_EDIT_REQUESTED, editCounterparty),
  takeLatest(counterpartyActionTypes.COUNTERPARTY_DELETE_REQUESTED, deleteCounterparty),
  takeLatest(counterpartyActionTypes.FETCH_DROPDOWNS, fetchDropdowns),
  takeLatest(
    counterpartyActionTypes.COUNTERPARTY_SSI_LIST_FETCH_REQUESTED,
    fetchCounterpartySSIList
  ),
  takeLatest(counterpartyActionTypes.COUNTERPARTY_SSI_ADD_REQUESTED, addCounterpartySSI),
  takeLatest(counterpartyActionTypes.COUNTERPARTY_SSI_EDIT_REQUESTED, editCounterpartySSI),
  takeLatest(counterpartyActionTypes.COUNTERPARTY_SSI_DELETE_REQUESTED, deleteCounterpartySSI),
];

export default counterpartySaga;
