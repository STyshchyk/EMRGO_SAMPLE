import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/tnc';

export const doUpdateTermsData = createAction(actionTypes.TNC_DATA_UPDATE_REQUESTED);
export const doUpdateTermsDataSuccess = createAction(actionTypes.TNC_DATA_UPDATE_SUCCEEDED);
export const doUpdateTermsDataFailure = createAction(actionTypes.TNC_DATA_UPDATE_FAILED);

export const doFetchTermsData = createAction(actionTypes.TNC_DATA_FETCH_REQUESTED);
export const doFetchTermsDataSuccess = createAction(actionTypes.TNC_DATA_FETCH_SUCCEEDED);
export const doFetchTermsDataFailure = createAction(actionTypes.TNC_DATA_FETCH_FAILED);

export const doFetchTermsStatus = createAction(actionTypes.TNC_STATUS_FETCH_REQUESTED);
export const doFetchTermsStatusSuccess = createAction(actionTypes.TNC_STATUS_FETCH_SUCCEEDED);
export const doFetchTermsStatusFailure = createAction(actionTypes.TNC_STATUS_FETCH_FAILED);

export const doAcceptTerms = createAction(actionTypes.TNC_ACCEPTANCE_REQUESTED);
export const doAcceptTermsSuccess = createAction(actionTypes.TNC_ACCEPTANCE_SUCCEEDED);
export const doAcceptTermsFailure = createAction(actionTypes.TNC_ACCEPTANCE_FAILED);
