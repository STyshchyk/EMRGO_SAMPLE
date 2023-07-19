import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/quotes';

export const doCreateQuoteRequest = createAction(actionTypes.CREATE_QUOTE_REQUESTED);
export const doCreateQuoteSuccess = createAction(actionTypes.CREATE_QUOTE_SUCCEEDED);
export const doCreateQuoteFailure = createAction(actionTypes.CREATE_QUOTE_FAILED);

export const doReadQuoteRequest = createAction(actionTypes.READ_QUOTE_REQUESTED);
export const doReadQuoteSuccess = createAction(actionTypes.READ_QUOTE_SUCCEEDED);
export const doReadQuoteFailure = createAction(actionTypes.READ_QUOTE_FAILED);

export const doUpdateQuoteRequest = createAction(actionTypes.UPDATE_QUOTE_REQUESTED);
export const doUpdateQuoteSuccess = createAction(actionTypes.UPDATE_QUOTE_SUCCEEDED);
export const doUpdateQuoteFailure = createAction(actionTypes.UPDATE_QUOTE_FAILED);

export const doDeleteQuoteRequest = createAction(actionTypes.DELETE_QUOTE_REQUESTED);
export const doDeleteQuoteSuccess = createAction(actionTypes.DELETE_QUOTE_SUCCEEDED);
export const doDeleteQuoteFailure = createAction(actionTypes.DELETE_QUOTE_FAILED);
