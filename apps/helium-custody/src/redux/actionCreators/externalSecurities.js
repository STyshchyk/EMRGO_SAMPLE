import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/externalSecurities";

export const doFetchExternalSecuritiesList = createAction(
  actionTypes.EXTERNAL_SECURITIES_LIST_FETCH_REQUESTED
);
export const doFetchExternalSecuritiesListSuccess = createAction(
  actionTypes.EXTERNAL_SECURITIES_LIST_FETCH_SUCCEEDED
);
export const doFetchExternalSecuritiesListFailure = createAction(
  actionTypes.EXTERNAL_SECURITIES_LIST_FETCH_FAILED
);

export const doAddExternalSecurities = createAction(actionTypes.EXTERNAL_SECURITIES_ADD_REQUESTED);
export const doAddExternalSecuritiesSuccess = createAction(
  actionTypes.EXTERNAL_SECURITIES_ADD_SUCCEEDED
);
export const doAddExternalSecuritiesFailure = createAction(
  actionTypes.EXTERNAL_SECURITIES_ADD_FAILED
);

export const doEditExternalSecurities = createAction(
  actionTypes.EXTERNAL_SECURITIES_EDIT_REQUESTED
);
export const doEditExternalSecuritiesSuccess = createAction(
  actionTypes.EXTERNAL_SECURITIES_EDIT_SUCCEEDED
);
export const doEditExternalSecuritiesFailure = createAction(
  actionTypes.EXTERNAL_SECURITIES_EDIT_FAILED
);

export const doDeleteExternalSecurities = createAction(
  actionTypes.EXTERNAL_SECURITIES_DELETE_REQUESTED
);
export const doDeleteExternalSecuritiesSuccess = createAction(
  actionTypes.EXTERNAL_SECURITIES_DELETE_SUCCEEDED
);
export const doDeleteExternalSecuritiesFailure = createAction(
  actionTypes.EXTERNAL_SECURITIES_DELETE_FAILED
);

export const doAddEquityExternalSecurities = createAction(
  actionTypes.EXTERNAL_SECURITIES_ADD_EQUITY_REQUESTED
);
export const doAddEquityExternalSecuritiesSuccess = createAction(
  actionTypes.EXTERNAL_SECURITIES_ADD_EQUITY_SUCCEEDED
);
export const doAddEquityExternalSecuritiesFailure = createAction(
  actionTypes.EXTERNAL_SECURITIES_ADD_EQUITY_FAILED
);

export const doSearchExternalSecurities = createAction(
  actionTypes.EXTERNAL_SECURITIES_SEARCH_REQUESTED
);
export const doSearchExternalSecuritiesSuccess = createAction(
  actionTypes.EXTERNAL_SECURITIES_SEARCH_SUCCEEDED
);
export const doSearchExternalSecuritiesFailure = createAction(
  actionTypes.EXTERNAL_SECURITIES_SEARCH_FAILED
);
export const doResetExternalSecuritiesSearchResults = createAction(
  actionTypes.EXTERNAL_SECURITIES_RESET_SEARCH_RESULTS
);
