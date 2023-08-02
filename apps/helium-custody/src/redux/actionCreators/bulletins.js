import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/bulletins";

export const doDropdownReadRequest = createAction(actionTypes.READ_DROPDOWN_REQUESTED);
export const doDropdownReadSuccess = createAction(actionTypes.READ_DROPDOWN_SUCCEEDED);
export const doDropdownReadFailure = createAction(actionTypes.READ_DROPDOWN_FAILED);

export const doFetchBulletinData = createAction(actionTypes.BULLETIN_FETCH_REQUESTED);
export const doFetchBulletinDataSuccess = createAction(actionTypes.BULLETIN_FETCH_SUCCEEDED);
export const doFetchBulletinDataFailure = createAction(actionTypes.BULLETIN_FETCH_FAILED);

export const doCreateBulletin = createAction(actionTypes.BULLETIN_CREATE_REQUESTED);
export const doCreateBulletinSuccess = createAction(actionTypes.BULLETIN_CREATE_SUCCEEDED);
export const doCreateBulletinFailure = createAction(actionTypes.BULLETIN_CREATE_FAILED);

export const doUploadBulletinFile = createAction(actionTypes.BULLETIN_FILE_UPLOAD_REQUESTED);
export const doUploadBulletinFileSuccess = createAction(actionTypes.BULLETIN_FILE_UPLOAD_SUCCEEDED);
export const doUploadBulletinFileFailure = createAction(actionTypes.BULLETIN_FILE_UPLOAD_FAILED);

export const doFetchBulletinDocument = createAction(actionTypes.BULLETIN_DOCUMENT_FETCH_REQUESTED);
export const doFetchBulletinDocumentSuccess = createAction(
  actionTypes.BULLETIN_DOCUMENT_FETCH_SUCCEEDED
);
export const doFetchBulletinDocumentFailure = createAction(
  actionTypes.BULLETIN_DOCUMENT_FETCH_FAILED
);

export const doUpdateBulletin = createAction(actionTypes.BULLETIN_UPDATE_REQUESTED);
export const doUpdateBulletinSuccess = createAction(actionTypes.BULLETIN_UPDATE_SUCCEEDED);
export const doUpdateBulletinFailure = createAction(actionTypes.BULLETIN_UPDATE_FAILED);

export const doDeleteBulletin = createAction(actionTypes.BULLETIN_DELETE_REQUESTED);
export const doDeleteBulletinSuccess = createAction(actionTypes.BULLETIN_DELETE_SUCCEEDED);
export const doDeleteBulletinFailure = createAction(actionTypes.BULLETIN_DELETE_FAILED);
