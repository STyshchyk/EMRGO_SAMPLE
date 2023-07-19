import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import * as documentActionCreators from '../actionCreators/documents';
import * as kycActionCreators from '../actionCreators/kyc';
import * as documentActionTypes from '../actionTypes/documents';
import * as wethaqAPIService from '../../services/wethaqAPIService';
import * as s3Service from '../../services/s3Service';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchUsers({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.getUsers, payload);
    const { data } = response;
    yield put(documentActionCreators.doFetchUsersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doFetchUsersFailure(errorMessage));
  }
}

function* fetchUserFiles({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.getUserFiles, payload);
    const { data } = response;
    yield put(documentActionCreators.doFetchUserFilesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doFetchUserFilesFailure(errorMessage));
  }
}

function* uploadFile({ payload }) {
  const { fileUploadLinkPayload, id } = payload;
  try {
    const response = yield call(wethaqAPIService.documentAPI.getUploadLink, fileUploadLinkPayload);
    const { data } = response;

    yield call(s3Service.putFile, {
      uploadURLData: data?.link,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t('messages:Uploaded')} ${fileUploadLinkPayload.originalFileName}`);
    if (payload?.isRevision) {
      const revisionPayload = {
        documentId: fileUploadLinkPayload.existingDocumentId,
        revisionFileKey: data.revisionFileKey,
        sukukId: payload.sukukId,
      };
      yield put(documentActionCreators.doProcessFile(revisionPayload));
    } else {
      const initPayload = {
        documentId: data.documentId,
        init: true,
        sukukId: payload.sukukId,
      };
      yield put(documentActionCreators.doProcessFile(initPayload));
    }
    yield put(documentActionCreators.doUploadFileSuccess({ data, id }));
    payload?.onSuccess();
    yield put(documentActionCreators.doFetchUserFiles({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doUploadFileFailure({ message: errorMessage, id }));
  }
}

function* processFile({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.processFile, payload);
    const { data } = response;
    yield put(documentActionCreators.doProcessFileSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(documentActionCreators.doFetchUserFiles({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doProcessFileFailure(errorMessage));
  }
}

function* downloadFile({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.getDownloadLink, payload);
    const { data } = response;

    const link = document.createElement('a');
    link.href = data.link;
    link.setAttribute('download', payload.fileName);
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
    document.body.removeChild(link);

    yield put(documentActionCreators.doDownloadFileSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doDownloadFileFailure(errorMessage));
  }
}

function* previewFile({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.getPreviewLink, payload);
    const { data } = response;
    yield put(documentActionCreators.doPreviewFileSuccess({ data: { ...data, fileName: payload.fileName } }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doPreviewFileFailure(errorMessage));
  }
}

function* fetchDocusignUrl({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.getDocusignURL, payload.requestPayload);
    const { data } = response;
    yield put(documentActionCreators.doFetchDocusignURLSuccess({ data }));

    if (typeof payload?.successCallback === 'function') {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doFetchDocusignURLFailure(errorMessage));
  }
}

function* updateDocumentPermissions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.updateDocumentPermissions, payload.payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doFetchKYCData(payload.kycFetchPayload));
    yield put(documentActionCreators.doUpdateDocumentPermissionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doUpdateDocumentPermissionsFailure(errorMessage));
  }
}

function* documentUploadRequest({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.requestDocumentUpload, payload.payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doFetchKYCData(payload.kycFetchPayload));
    yield put(documentActionCreators.doDocumentUploadRequestSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doDocumentUploadRequestFailure(errorMessage));
  }
}

function* documentMarkUpload({ payload }) {
  try {
    const response = yield call(wethaqAPIService.documentAPI.markDocumentObtained, payload.payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(kycActionCreators.doFetchKYCData(payload.kycFetchPayload));
    yield put(documentActionCreators.doDocumentMarkObtainedSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(documentActionCreators.doDocumentMarkObtainedFailure(errorMessage));
  }
}

const documentsSaga = [
  takeLatest(documentActionTypes.FETCH_USERS_REQUESTED, fetchUsers),
  takeLatest(documentActionTypes.FETCH_USER_FILES_REQUESTED, fetchUserFiles),
  takeEvery(documentActionTypes.UPLOAD_FILE_REQUESTED, uploadFile),
  takeLatest(documentActionTypes.PROCESS_FILE_REQUESTED, processFile),
  takeEvery(documentActionTypes.DWONLOAD_FILE_REQUESTED, downloadFile),
  takeEvery(documentActionTypes.PREVIEW_FILE_REQUESTED, previewFile),
  takeEvery(documentActionTypes.FETCH_DOCUSIGN_URL_REQUESTED, fetchDocusignUrl),
  takeEvery(documentActionTypes.UPDATE_DOCUMENT_PERMISSION_REQUESTED, updateDocumentPermissions),
  takeEvery(documentActionTypes.DOCUMENT_UPLOAD_REQUEST_REQUESTED, documentUploadRequest),
  takeEvery(documentActionTypes.DOCUMENT_MARK_OBTAINED_REQUESTED, documentMarkUpload),
];

export default documentsSaga;
