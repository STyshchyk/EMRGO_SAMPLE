import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/dropdown";

export const doFetchDropdownOptions = createAction(actionTypes.FETCH_DROPDOWN_OPTIONS_REQUESTED);
export const doFetchDropdownOptionsSuccess = createAction(
  actionTypes.FETCH_DROPDOWN_OPTIONS_SUCCEEDED
);
export const doFetchDropdownOptionsFailure = createAction(
  actionTypes.FETCH_DROPDOWN_OPTIONS_FAILED
);
export const doResetDropdownState = createAction(actionTypes.RESET_DROPDOWN_STATE);
