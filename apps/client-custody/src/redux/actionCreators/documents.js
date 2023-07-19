import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/documents';

export const doFetchUsers = createAction(actionTypes.FETCH_USERS_REQUESTED);
export const doFetchUsersSuccess = createAction(actionTypes.FETCH_USERS_SUCCEEDED);
export const doFetchUsersFailure = createAction(actionTypes.FETCH_USERS_FAILED);

export const doFetchUserFiles = createAction(actionTypes.FETCH_USER_FILES_REQUESTED);
export const doFetchUserFilesSuccess = createAction(actionTypes.FETCH_USER_FILES_SUCCEEDED);
export const doFetchUserFilesFailure = createAction(actionTypes.FETCH_USER_FILES_FAILED);

export const doUploadFile = createAction(actionTypes.UPLOAD_FILE_REQUESTED);
export const doUploadFileSuccess = createAction(actionTypes.UPLOAD_FILE_SUCCEEDED);
export const doUploadFileFailure = createAction(actionTypes.UPLOAD_FILE_FAILED);

export const doProcessFile = createAction(actionTypes.PROCESS_FILE_REQUESTED);
export const doProcessFileSuccess = createAction(actionTypes.PROCESS_FILE_SUCCEEDED);
export const doProcessFileFailure = createAction(actionTypes.PROCESS_FILE_FAILED);

export const doDownloadFile = createAction(actionTypes.DWONLOAD_FILE_REQUESTED);
export const doDownloadFileSuccess = createAction(actionTypes.DWONLOAD_FILE_SUCCEEDED);
export const doDownloadFileFailure = createAction(actionTypes.DWONLOAD_FILE_FAILED);

export const doPreviewFile = createAction(actionTypes.PREVIEW_FILE_REQUESTED);
export const doPreviewFileSuccess = createAction(actionTypes.PREVIEW_FILE_SUCCEEDED);
export const doPreviewFileFailure = createAction(actionTypes.PREVIEW_FILE_FAILED);

export const doFetchDocusignURL = createAction(actionTypes.FETCH_DOCUSIGN_URL_REQUESTED);
export const doFetchDocusignURLSuccess = createAction(actionTypes.FETCH_DOCUSIGN_URL_SUCCEEDED);
export const doFetchDocusignURLFailure = createAction(actionTypes.FETCH_DOCUSIGN_URL_FAILED);

export const doUpdateDocumentPermissions = createAction(actionTypes.UPDATE_DOCUMENT_PERMISSION_REQUESTED);
export const doUpdateDocumentPermissionsSuccess = createAction(actionTypes.UPDATE_DOCUMENT_PERMISSION_SUCCEEDED);
export const doUpdateDocumentPermissionsFailure = createAction(actionTypes.UPDATE_DOCUMENT_PERMISSION_FAILED);

export const doDocumentUploadRequest = createAction(actionTypes.DOCUMENT_UPLOAD_REQUEST_REQUESTED);
export const doDocumentUploadRequestSuccess = createAction(actionTypes.DOCUMENT_UPLOAD_REQUEST_SUCCEEDED);
export const doDocumentUploadRequestFailure = createAction(actionTypes.DOCUMENT_UPLOAD_REQUEST_FAILED);

export const doDocumentMarkObtained = createAction(actionTypes.DOCUMENT_MARK_OBTAINED_REQUESTED);
export const doDocumentMarkObtainedSuccess = createAction(actionTypes.DOCUMENT_MARK_OBTAINED_SUCCEEDED);
export const doDocumentMarkObtainedFailure = createAction(actionTypes.DOCUMENT_MARK_OBTAINED_FAILED);
