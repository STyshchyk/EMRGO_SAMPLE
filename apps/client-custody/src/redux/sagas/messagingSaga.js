import { call, put, fork, takeLatest } from 'redux-saga/effects';

import * as messageActionCreators from '../actionCreators/messaging';
import * as actionTypes from '../actionTypes/messaging';
import * as wethaqAPIService from '../../services/wethaqAPIService';
import * as wethaqSocketService from '../../services/wethaqSocketService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchMessages({ payload }) {
  try {
    const response = yield call(wethaqAPIService.messagingAPI.fetchMessagesForLA, payload);
    yield put(messageActionCreators.doFetchMessagesSuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(messageActionCreators.doFetchMessagesFailure(errorMessage));
  }
}

function* submitMessage({ payload }) {
  try {
    const response = yield call(wethaqAPIService.messagingAPI.submitMessage, payload);
    // yield put(messageActionCreators.doFetchMessagesRequest(payload));
    yield put(messageActionCreators.doSubmitMessagesSuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(messageActionCreators.doSubmitMessagesFailure(errorMessage));
  }
}

function* openMessageSocket({ payload }) {
  const messageSocket = yield call(wethaqSocketService.connect, 'socket/v1/message');
  yield call(wethaqSocketService.subscribeToRoom, messageSocket, payload.roomId);
  yield fork(wethaqSocketService.read, messageSocket, messageActionCreators.doOpenMessageSocketSuccess);
}

const messagingSaga = [
  takeLatest(actionTypes.MESSAGING_GET_MESSAGES_REQUESTED, fetchMessages),
  takeLatest(actionTypes.MESSAGING_SUBMIT_MESSAGES_REQUESTED, submitMessage),
  takeLatest(actionTypes.OPEN_MESSAGE_SOCKET_REQUESTED, openMessageSocket),
];

export default messagingSaga;
