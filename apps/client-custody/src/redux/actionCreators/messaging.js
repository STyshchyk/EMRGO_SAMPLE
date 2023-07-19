import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/messaging';

export const doFetchMessagesRequest = createAction(actionTypes.MESSAGING_GET_MESSAGES_REQUESTED);
export const doFetchMessagesSuccess = createAction(actionTypes.MESSAGING_GET_MESSAGES_SUCCEEDED);
export const doFetchMessagesFailure = createAction(actionTypes.MESSAGING_GET_MESSAGES_FAILED);

export const doSubmitMessagesRequest = createAction(actionTypes.MESSAGING_SUBMIT_MESSAGES_REQUESTED);
export const doSubmitMessagesSuccess = createAction(actionTypes.MESSAGING_SUBMIT_MESSAGES_SUCCEEDED);
export const doSubmitMessagesFailure = createAction(actionTypes.MESSAGING_SUBMIT_MESSAGES_FAILED);

export const doOpenMessageSocketRequest = createAction(actionTypes.OPEN_MESSAGE_SOCKET_REQUESTED);
export const doOpenMessageSocketSuccess = createAction(actionTypes.OPEN_MESSAGE_SOCKET_SUCCEEDED);
export const doOpenMessageSocketFailure = createAction(actionTypes.OPEN_MESSAGE_SOCKET_FAILED);