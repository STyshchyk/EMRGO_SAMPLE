import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/form";

export const doFetchForm = createAction(actionTypes.FETCH_FORM_REQUESTED);
export const doFetchFormSuccess = createAction(actionTypes.FETCH_FORM_SUCCEEDED);
export const doFetchFormFailure = createAction(actionTypes.FETCH_FORM_FAILED);
export const doPostFormRequested = createAction(actionTypes.POST_FORM_REQUESTED);
export const doPostFormSuccess = createAction(actionTypes.POST_FORM_SUCCESS);
