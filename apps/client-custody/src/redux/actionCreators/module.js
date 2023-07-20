import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/module";

// TODO - CLEANUP (ON EXPERIMENTAL)
export const doFetchModuleData = createAction(actionTypes.MODULE_FETCH_DATA_REQUESTED);
export const doFetchModuleDataSuccess = createAction(actionTypes.MODULE_FETCH_DATA_SUCCEEDED);
export const doFetchModuleDataFailure = createAction(actionTypes.MODULE_FETCH_DATA_FAILED);

export const doAddModuleAccess = createAction(actionTypes.ADD_MODULE_ACCESS_REQUESTED);
export const doAddModuleAccessSuccess = createAction(actionTypes.ADD_MODULE_ACCESS_SUCCEEDED);
export const doAddModuleAccessFailure = createAction(actionTypes.ADD_MODULE_ACCESS_FAILED);

export const doGrantModuleAccess = createAction(actionTypes.GRANT_MODULE_ACCESS_REQUESTED);
export const doGrantModuleAccessSuccess = createAction(actionTypes.GRANT_MODULE_ACCESS_SUCCEEDED);
export const doGrantModuleAccessFailure = createAction(actionTypes.GRANT_MODULE_ACCESS_FAILED);

export const doRevokeModuleAccess = createAction(actionTypes.REVOKE_MODULE_ACCESS_REQUESTED);
export const doRevokeModuleAccessSuccess = createAction(actionTypes.REVOKE_MODULE_ACCESS_SUCCEEDED);
export const doRevokeModuleAccessFailure = createAction(actionTypes.REVOKE_MODULE_ACCESS_FAILED);

export const doRequestModuleAccess = createAction(actionTypes.REQUEST_MODULE_ACCESS_REQUESTED);
export const doRequestModuleAccessSuccess = createAction(
  actionTypes.REQUEST_MODULE_ACCESS_SUCCEEDED
);
export const doRequestModuleAccessFailure = createAction(actionTypes.REQUEST_MODULE_ACCESS_FAILED);
