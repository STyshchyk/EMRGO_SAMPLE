import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/corporateActionEvents';

export const doFetchCAEvents = createAction(actionTypes.CA_EVENTS_FETCH_REQUESTED);
export const doFetchCAEventsSuccess = createAction(actionTypes.CA_EVENTS_FETCH_SUCCEEDED);
export const doFetchCAEventsFailure = createAction(actionTypes.CA_EVENTS_FETCH_FAILED);

export const doCancelCAEvent = createAction(actionTypes.CA_EVENT_CANCEL_REQUESTED);
export const doCancelCAEventSuccess = createAction(actionTypes.CA_EVENTS_FETCH_SUCCEEDED);
export const doCancelCAEventFailure = createAction(actionTypes.CA_EVENT_CANCEL_FAILED);

export const doAddCAEvent = createAction(actionTypes.CA_EVENT_ADD_REQUESTED);
export const doAddCAEventSuccess = createAction(actionTypes.CA_EVENT_ADD_SUCCEEDED);
export const doAddCAEventFailure = createAction(actionTypes.CA_EVENT_ADD_FAILED);

export const doEditCAEvent = createAction(actionTypes.CA_EVENT_EDIT_REQUESTED);
export const doEditCAEventSuccess = createAction(actionTypes.CA_EVENT_EDIT_SUCCEEDED);
export const doEditCAEventFailure = createAction(actionTypes.CA_EVENT_EDIT_FAILED);

export const doSubmitClientResponse = createAction(actionTypes.CA_EVENT_CLIENT_RESPONSE_REQUESTED);
export const doSubmitClientResponseSuccess = createAction(actionTypes.CA_EVENT_CLIENT_RESPONSE_SUCCEEDED);
export const doSubmitClientResponseFailure = createAction(actionTypes.CA_EVENT_CLIENT_RESPONSE_FAILED);

export const doFetchCAEventbyId = createAction(actionTypes.CA_EVENT_FETCH_CA_EVENT_REQUESTED);
export const doFetchCAEventbyIdSuccess = createAction(actionTypes.CA_EVENT_FETCH_CA_EVENT_SUCCEEDED);
export const doFetchCAEventbyIdFailure = createAction(actionTypes.CA_EVENT_FETCH_CA_EVENT_FAILED);

export const doResetCAEventState = createAction(actionTypes.CA_EVENT_RESET_STATE);
