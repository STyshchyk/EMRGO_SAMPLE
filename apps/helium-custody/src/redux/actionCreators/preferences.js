import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/preferences";

export const doFetchPreferences = createAction(actionTypes.PREFERENCES_FETCH_REQUESTED);
export const doFetchPreferencesSuccess = createAction(actionTypes.PREFERENCES_FETCH_SUCCEEDED);
export const doFetchPreferencesFailure = createAction(actionTypes.PREFERENCES_FETCH_FAILED);
