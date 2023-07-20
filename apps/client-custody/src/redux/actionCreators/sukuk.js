import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/sukuk";

export const doFetchSukukOverviewData = createAction(actionTypes.SUKUK_OVERVIEW_DATA_REQUESTED);
export const doFetchSukukOverviewDataSuccess = createAction(
  actionTypes.SUKUK_OVERVIEW_DATA_SUCCEEDED
);
export const doFetchSukukOverviewDataFailure = createAction(actionTypes.SUKUK_OVERVIEW_DATA_FAILED);
export const doResetSukukOverviewData = createAction(
  actionTypes.SUKUK_OVERVIEW_DATA_RESET_REQUESTED
);

export const doSetupProject = createAction(actionTypes.SUKUK_PROJECT_SETUP_REQUESTED);
export const doSetupProjectSuccess = createAction(actionTypes.SUKUK_PROJECT_SETUP_SUCCEEDED);
export const doSetupProjectFailure = createAction(actionTypes.SUKUK_PROJECT_SETUP_FAILED);
