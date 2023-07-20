/* eslint-disable consistent-return */

import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import i18n from "../../i18n";
import * as s3Service from "../../services/s3Service";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as securitiesServicesActionCreators from "../actionCreators/securitiesServices";
import * as securitiesServicesActionTypes from "../actionTypes/securitiesServices";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* uploadFile({ payload }) {
  try {
    const response = yield call(wethaqAPIService.fileAPI.upload, {
      type: "custodyAndClearing",
      ...payload.requestPayload,
    });
    const { data } = response;
    const { keyName, file } = payload;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file,
    });

    yield call(toast.success, `${i18n.t("messages:Uploaded")} ${file?.name}`);
    yield put(
      securitiesServicesActionCreators.doUploadFileSuccess({
        data: {
          ...data,
          name: file?.name,
          keyName,
        },
      })
    );

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      securitiesServicesActionCreators.doUploadFileFailure({
        message: errorMessage,
        key: payload.keyName,
      })
    );
  }
}

function* fetchFile({ payload }) {
  const key = payload.fileName;

  try {
    const response = yield call(wethaqAPIService.fileAPI.download, payload);
    const { data } = response;
    data.key = key;

    yield put(securitiesServicesActionCreators.doFetchFileSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(securitiesServicesActionCreators.doFetchFileFailure({ message: errorMessage, key }));
  }
}

const securitiesServicesSaga = [
  takeLatest(securitiesServicesActionTypes.SECURITIES_SERVICES_FILE_UPLOAD_REQUESTED, uploadFile),
  takeLatest(securitiesServicesActionTypes.SECURITIES_SERVICES_FILE_FETCH_REQUESTED, fetchFile),
];

export default securitiesServicesSaga;
