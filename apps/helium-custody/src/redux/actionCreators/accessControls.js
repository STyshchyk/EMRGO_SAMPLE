import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/accessControls";

export const doFetchAccessControls = createAction(actionTypes.ACCESS_CONTROLS_FETCH_REQUESTED);
export const doFetchAccessControlsSuccess = createAction(
  actionTypes.ACCESS_CONTROLS_FETCH_SUCCEEDED
);
export const doFetchAccessControlsFailure = createAction(actionTypes.ACCESS_CONTROLS_FETCH_FAILED);
export const doResetAccessControlsState = createAction(actionTypes.ACCESS_CONTROLS_RESET);
