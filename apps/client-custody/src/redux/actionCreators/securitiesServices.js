import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/securitiesServices';

export const doUploadFile = createAction(actionTypes.SECURITIES_SERVICES_FILE_UPLOAD_REQUESTED);
export const doUploadFileSuccess = createAction(actionTypes.SECURITIES_SERVICES_FILE_UPLOAD_SUCCEEDED);
export const doUploadFileFailure = createAction(actionTypes.SECURITIES_SERVICES_FILE_UPLOAD_FAILED);

export const doFetchFile = createAction(actionTypes.SECURITIES_SERVICES_FILE_FETCH_REQUESTED);
export const doFetchFileSuccess = createAction(actionTypes.SECURITIES_SERVICES_FILE_FETCH_SUCCEEDED);
export const doFetchFileFailure = createAction(actionTypes.SECURITIES_SERVICES_FILE_FETCH_FAILED);

export const doResetFilesState = createAction(actionTypes.SECURITIES_SERVICES_RESET_FILES_STATE);
