/* eslint-disable consistent-return */

import { toast } from "react-toastify";

import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

import i18n from "../../i18n";
import * as s3Service from "../../services/s3Service";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as authActionCreators from "../actionCreators/auth";
import * as clientTermsActionCreators from "../actionCreators/clientTerms";
import * as entitiesActionCreators from "../actionCreators/entities";
import * as clientTermsActionTypes from "../actionTypes/clientTerms";
// import * as s3Service from '../../services/s3Service';

import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchTerms() {
  try {
    const response = yield call(wethaqAPIService.clientTermsAPI.getClientTerms);
    const { data } = response;

    yield put(clientTermsActionCreators.doFetchTermsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doFetchTermsFailure(errorMessage));
  }
}

function* fetchInstructions() {
  try {
    const response = yield call(wethaqAPIService.clientTermsAPI.getInstructions);
    const { data } = response;

    yield put(clientTermsActionCreators.doFetchInstructionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doFetchInstructionsFailure(errorMessage));
  }
}

function* fetchW8Ben() {
  try {
    const response = yield call(wethaqAPIService.clientTermsAPI.getW8Ben);
    const { data } = response;

    yield put(clientTermsActionCreators.doFetchW8BenSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doFetchW8BenFailure(errorMessage));
  }
}

function* fetchBoardResolution() {
  try {
    const response = yield call(wethaqAPIService.clientTermsAPI.getBoardResolutionSample);
    const { data } = response;

    yield put(clientTermsActionCreators.doFetchBoardResolutionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doFetchBoardResolutionFailure(errorMessage));
  }
}

function* submitTerms({ payload }) {
  try {
    const response = yield call(wethaqAPIService.clientTermsAPI.submitClientTerms, payload);
    const { data } = response;
    yield put(clientTermsActionCreators.doSubmitTermsSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") payload.successCallback();
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doSubmitTermsFailure(errorMessage));
  }
}

// TODO - MAKE AN API CALL TO FETCH ENTITIES AFTER CLIENT TERMS HAS BEEN SUCCESSFULLY VERIFIED
function* verifyTerms({ payload }) {
  try {
    const response = yield call(wethaqAPIService.clientTermsAPI.verifyTerms, payload);
    const { data } = response;
    yield put(clientTermsActionCreators.doSubmitVerifyTermsSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doFetchEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doSubmitVerifyTermsFailure(errorMessage));
  }
}

function* uploadFile({ payload }) {
  try {
    // Fetch presigned S3 PUT URL
    const response = yield call(wethaqAPIService.fileAPI.upload, payload.requestPayload);
    const { data } = response;

    data.name = payload.requestPayload.name;
    data.keyName = payload.keyName;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t("messages:Uploaded")} ${payload.requestPayload.name}`);

    yield put(clientTermsActionCreators.doUploadFileSuccess({ data }));

    yield put(authActionCreators.doFetchCurrentUserData());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      clientTermsActionCreators.doUploadFileFailure({ message: errorMessage, key: payload.keyName })
    );
  }
}

function* fetchUploadedFile({ payload }) {
  const key = payload.fileName;
  try {
    const response = yield call(wethaqAPIService.fileAPI.download, payload);
    const { data } = response;
    data.fileName = key;
    window.open(data.link);
    yield put(clientTermsActionCreators.doFetchUploadedFileSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(clientTermsActionCreators.doFetchUploadedFileFailure({ message: errorMessage, key }));
  }
}

const clientTermsSaga = [
  takeLatest(clientTermsActionTypes.FETCH_TERMS_REQUESTED, fetchTerms),
  takeLatest(clientTermsActionTypes.FETCH_INSTRUCTIONS_REQUESTED, fetchInstructions),
  takeLatest(clientTermsActionTypes.FETCH_W8BEN_REQUESTED, fetchW8Ben),
  takeLatest(clientTermsActionTypes.FETCH_BOARD_RESOLUTION_SAMPLE_REQUESTED, fetchBoardResolution),
  takeLatest(clientTermsActionTypes.SUBMIT_TERMS_REQUESTED, submitTerms),
  takeEvery(clientTermsActionTypes.UPLOAD_FILE_REQUESTED, uploadFile),
  takeEvery(clientTermsActionTypes.FETCH_UPLOADED_FILES_REQUESTED, fetchUploadedFile),
  takeLatest(clientTermsActionTypes.SUBMIT_VERIFY_TERMS_REQUESTED, verifyTerms),
];

export default clientTermsSaga;
