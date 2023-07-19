import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import * as bulletinActionCreators from '../actionCreators/bulletins';
import * as actionTypes from '../actionTypes/bulletins';
import * as wethaqAPIService from '../../services/wethaqAPIService';
import * as s3Service from '../../services/s3Service';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* readDropdownDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(bulletinActionCreators.doDropdownReadSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doDropdownReadFailure(errorMessage));
  }
}

function* fetchBulletinData() {
  try {
    const response = yield call(wethaqAPIService.bulletinAPI.fetchBulletins);
    const { data } = response;
    yield put(bulletinActionCreators.doFetchBulletinDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doFetchBulletinDataFailure(errorMessage));
  }
}

function* uploadBulletinFile({ payload }) {
  try {
    const params = {
      requestPayload: payload.requestPayload,
    };
    const response = yield call(wethaqAPIService.bulletinAPI.uploadBulletinFile, params);
    const { data } = response;
    data.keyName = payload.keyName;

    yield call(s3Service.putFile, {
      uploadURLData: data?.link,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t('messages:Uploaded')} ${payload.requestPayload.originalFileName}`);
    yield put(bulletinActionCreators.doUploadBulletinFileSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doUploadBulletinFileFailure({ message: errorMessage, key: payload.keyName || payload.name, index: payload.index }));
  }
}

function* createBulletin({ payload }) {
  try {
    const response = yield call(wethaqAPIService.bulletinAPI.createBulletin, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(bulletinActionCreators.doCreateBulletinSuccess({ data }));
    yield put(bulletinActionCreators.doFetchBulletinData());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doCreateBulletinFailure(errorMessage));
  }
}

function* deleteBulletin({ payload }) {
  try {
    const response = yield call(wethaqAPIService.bulletinAPI.deleteBulletin, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(bulletinActionCreators.doDeleteBulletinSuccess({ data }));
    yield put(bulletinActionCreators.doFetchBulletinData());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doDeleteBulletinFailure(errorMessage));
  }
}

function* fetchBulletinDocument({ payload }) {
  try {
    const response = yield call(wethaqAPIService.bulletinAPI.fetchBulletinDocument, payload);
    const { data } = response;
    yield put(bulletinActionCreators.doFetchBulletinDocumentSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doFetchBulletinDocumentFailure(errorMessage));
  }
}

function* updateBulletin({ payload }) {
  try {
    const response = yield call(wethaqAPIService.bulletinAPI.updateBulletin, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(bulletinActionCreators.doUpdateBulletinSuccess({ data }));
    yield put(bulletinActionCreators.doFetchBulletinData());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(bulletinActionCreators.doUpdateBulletinFailure(errorMessage));
  }
}

const notificationSaga = [
  takeLatest(actionTypes.READ_DROPDOWN_REQUESTED, readDropdownDetails),
  takeLatest(actionTypes.BULLETIN_FETCH_REQUESTED, fetchBulletinData),
  takeLatest(actionTypes.BULLETIN_FILE_UPLOAD_REQUESTED, uploadBulletinFile),
  takeLatest(actionTypes.BULLETIN_CREATE_REQUESTED, createBulletin),
  takeLatest(actionTypes.BULLETIN_DELETE_REQUESTED, deleteBulletin),
  takeLatest(actionTypes.BULLETIN_DOCUMENT_FETCH_REQUESTED, fetchBulletinDocument),
  takeLatest(actionTypes.BULLETIN_UPDATE_REQUESTED, updateBulletin),
];

export default notificationSaga;
