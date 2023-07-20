import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as CAEventsActionCreators from "../actionCreators/corporateActionEvents";
import * as CAEventsActionTypes from "../actionTypes/corporateActionEvents";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchCorporateActionEventsList() {
  try {
    const response = yield call(
      wethaqAPIService.corporateActionEventsAPI.getCorporateActionEventsList
    );
    const { data } = response;
    yield put(CAEventsActionCreators.doFetchCAEventsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(CAEventsActionCreators.doFetchCAEventsFailure(errorMessage));
  }
}

function* cancelCorporateActionEvent({ payload }) {
  const { requestPayload, successCallback } = payload;

  try {
    const response = yield call(
      wethaqAPIService.corporateActionEventsAPI.cancelCorporateActionEvent,
      requestPayload
    );
    const { data } = response;
    yield put(CAEventsActionCreators.doCancelCAEventSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(CAEventsActionCreators.doCancelCAEventFailure(errorMessage));
  }
}

function* addCorporateActionEvent({ payload }) {
  const { requestPayload, successCallback } = payload;

  try {
    const response = yield call(
      wethaqAPIService.corporateActionEventsAPI.addCorporateActionEvent,
      requestPayload
    );
    const { data } = response;
    yield put(CAEventsActionCreators.doAddCAEventSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(CAEventsActionCreators.doAddCAEventFailure(errorMessage));
  }
}

function* editCorporateActionEvent({ payload }) {
  const { requestPayload, successCallback } = payload;

  try {
    const response = yield call(
      wethaqAPIService.corporateActionEventsAPI.editCorporateActionEvent,
      requestPayload
    );
    const { data } = response;
    yield put(CAEventsActionCreators.doEditCAEventSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(CAEventsActionCreators.doEditCAEventFailure(errorMessage));
  }
}

function* submitCAEventClientResponse({ payload }) {
  const { requestPayload, successCallback } = payload;

  try {
    const response = yield call(
      wethaqAPIService.corporateActionEventsAPI.submitCAEventClientResponse,
      requestPayload
    );
    const { data } = response;
    yield put(CAEventsActionCreators.doSubmitClientResponseSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(CAEventsActionCreators.doSubmitClientResponseFailure(errorMessage));
  }
}

function* fetchCorporateActionEventById({ payload }) {
  const { requestPayload } = payload;

  try {
    const response = yield call(
      wethaqAPIService.corporateActionEventsAPI.getCorporationActionEvent,
      requestPayload
    );
    const { data } = response;
    yield put(CAEventsActionCreators.doFetchCAEventbyIdSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(CAEventsActionCreators.doFetchCAEventbyIdSuccess(errorMessage));
  }
}

const corporateActionEventsSaga = [
  takeLatest(CAEventsActionTypes.CA_EVENTS_FETCH_REQUESTED, fetchCorporateActionEventsList),
  takeLatest(CAEventsActionTypes.CA_EVENT_CANCEL_REQUESTED, cancelCorporateActionEvent),
  takeLatest(CAEventsActionTypes.CA_EVENT_ADD_REQUESTED, addCorporateActionEvent),
  takeLatest(CAEventsActionTypes.CA_EVENT_EDIT_REQUESTED, editCorporateActionEvent),
  takeLatest(CAEventsActionTypes.CA_EVENT_CLIENT_RESPONSE_REQUESTED, submitCAEventClientResponse),
  takeLatest(CAEventsActionTypes.CA_EVENT_FETCH_CA_EVENT_REQUESTED, fetchCorporateActionEventById),
];

export default corporateActionEventsSaga;
