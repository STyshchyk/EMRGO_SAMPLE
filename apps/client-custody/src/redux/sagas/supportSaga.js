import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as s3Service from "../../services/s3Service";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as supportActionCreators from "../actionCreators/support";
import * as supportActionTypes from "../actionTypes/support";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* readDropdownDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(supportActionCreators.doDropdownReadSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(supportActionCreators.doDropdownReadFailure(errorMessage));
  }
}

function* fetchTFATickets({ payload }) {
  try {
    const response = yield call(wethaqAPIService.supportAPI.fetchTFATickets, payload);
    const { data } = response;

    yield put(supportActionCreators.doFetchTFATicketsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(supportActionCreators.doFetchTFATicketsFailure(errorMessage));
  }
}

function* uploadTFAVerificationFile({ payload }) {
  try {
    const params = {
      requestPayload: payload.requestPayload,
    };
    const response = yield call(wethaqAPIService.supportAPI.upload2faVerificationFile, params);
    const { data } = response;
    data.keyName = payload.keyName;

    // Note: data?.link object is expected to contain url property

    yield call(s3Service.putFile, {
      uploadURLData: data?.link,
      file: payload?.file,
    });

    yield call(toast.success, `Uploaded ${payload.requestPayload.originalFileName}`);
    yield put(supportActionCreators.doUploadTFADocumentSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      supportActionCreators.doUploadTFADocumentFailure({
        message: errorMessage,
        key: payload.keyName || payload.name,
        index: payload.index,
      })
    );
  }
}

function* fetchTFAVerificationDocument({ payload }) {
  try {
    const response = yield call(wethaqAPIService.supportAPI.fetchTFAVerificationDocument, payload);
    const { data } = response;
    yield put(supportActionCreators.doFetchTFAVerificationDocumentSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(supportActionCreators.doFetchTFAVerificationDocumentFailure(errorMessage));
  }
}

function* createTFATicket({ payload }) {
  try {
    const response = yield call(wethaqAPIService.supportAPI.createTFATicket, payload);
    const { data } = response;
    yield call(toast.success, "TFA Ticket created successfully", { autoClose: 5000 });
    yield put(supportActionCreators.doCreateTFATicketSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(supportActionCreators.doCreateTFATicketFailure(errorMessage));
  }
}

function* deleteTFATicket({ payload }) {
  try {
    const response = yield call(wethaqAPIService.supportAPI.deleteTFATicket, payload);
    const { data } = response;
    yield call(toast.success, "TFA Ticket deleted successfully", { autoClose: 5000 });
    yield put(supportActionCreators.doDeleteTFATicketSuccess({ data }));
    yield put(supportActionCreators.doFetchTFATickets());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(supportActionCreators.doDeleteTFATicketFailure(errorMessage));
  }
}

function* approveTFATicket({ payload }) {
  try {
    const response = yield call(wethaqAPIService.supportAPI.approveTFATicket, payload);
    const { data } = response;
    yield call(toast.success, "TFA Ticket approved successfully", { autoClose: 5000 });
    yield put(supportActionCreators.doApproveTFATicketSuccess({ data }));
    yield put(supportActionCreators.doFetchTFATickets());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(supportActionCreators.doApproveTFATicketFailure(errorMessage));
  }
}

const supportSaga = [
  takeLatest(supportActionTypes.READ_DROPDOWN_REQUESTED, readDropdownDetails),
  takeLatest(supportActionTypes.FETCH_TFA_TICKETS_REQUESTED, fetchTFATickets),
  takeLatest(
    supportActionTypes.UPLOAD_TFA_VERIFICATION_DOCUMENT_REQUESTED,
    uploadTFAVerificationFile
  ),
  takeLatest(supportActionTypes.TFA_TICKET_CREATE_REQUESTED, createTFATicket),
  takeLatest(supportActionTypes.TFA_TICKET_DELETE_REQUESTED, deleteTFATicket),
  takeLatest(supportActionTypes.TFA_TICKET_APPROVE_REQUESTED, approveTFATicket),
  takeLatest(
    supportActionTypes.TFA_VERIFICATION_DOCUMENT_FETCH_REQUESTED,
    fetchTFAVerificationDocument
  ),
];

export default supportSaga;
