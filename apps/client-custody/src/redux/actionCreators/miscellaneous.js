import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/miscellaneous";

export const doFetchDocumentLinkRequest = createAction(actionTypes.DOCUMENT_LINK_FETCH_REQUESTED);
export const doFetchDocumentLinkSuccess = createAction(actionTypes.DOCUMENT_LINK_FETCH_SUCCEEDED);
export const doFetchDocumentLinkFailure = createAction(actionTypes.DOCUMENT_LINK_FETCH_FAILED);

export const doFetchStaticFileRequest = createAction(actionTypes.STATIC_FILE_REQUESTED);
export const doFetchStaticFileSuccess = createAction(actionTypes.STATIC_FILE_SUCCEEDED);
export const doFetchStaticFileFailure = createAction(actionTypes.STATIC_FILE_FAILED);

export const doReadTableConfigRequest = createAction(actionTypes.READ_TABLE_CONFIG_REQUESTED);
export const doReadTableConfigSuccess = createAction(actionTypes.READ_TABLE_CONFIG_SUCCEEDED);
export const doReadTableConfigFailure = createAction(actionTypes.READ_TABLE_CONFIG_FAILED);

export const doUpdateTableConfigRequest = createAction(actionTypes.UPDATE_TABLE_CONFIG_REQUESTED);
export const doUpdateTableConfigSuccess = createAction(actionTypes.UPDATE_TABLE_CONFIG_SUCCEEDED);
export const doUpdateTableConfigFailure = createAction(actionTypes.UPDATE_TABLE_CONFIG_FAILED);
