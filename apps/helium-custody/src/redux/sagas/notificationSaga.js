import { call, fork, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as wethaqSocketService from "../../services/wethaqSocketService";
import * as notificationActionCreators from "../actionCreators/notification";
import * as actionTypes from "../actionTypes/notification";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchNotification({ payload }) {
  try {
    const response = yield call(wethaqAPIService.notificationsAPI.fetchNotifications, payload);
    yield put(notificationActionCreators.doFetchNotificationSuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(notificationActionCreators.doFetchNotificationFailure(errorMessage));
  }
}

function* notificationSetRead({ payload }) {
  try {
    const response = yield call(wethaqAPIService.notificationsAPI.notificationSetRead, payload);
    yield put(notificationActionCreators.doFetchNotificationRequest({ isUnread: true }));
    yield put(notificationActionCreators.doNotificationSetReadSuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(notificationActionCreators.doNotificationSetReadFailure(errorMessage));
  }
}

function* openNotificationSocket({ payload }) {
  const notificationSocket = yield call(wethaqSocketService.connect, "socket/v1/notification");
  yield call(wethaqSocketService.subscribeToRoom, notificationSocket, payload.userId);
  yield fork(
    wethaqSocketService.read,
    notificationSocket,
    notificationActionCreators.doOpenNotificationSocketSuccess
  );
}

const notificationSaga = [
  takeLatest(actionTypes.NOTIFICATION_FETCH_ALL_REQUESTED, fetchNotification),
  takeLatest(actionTypes.NOTIFICATION_SET_READ_REQUESTED, notificationSetRead),
  takeLatest(actionTypes.OPEN_NOTIFICATION_SOCKET_REQUESTED, openNotificationSocket),
];

export default notificationSaga;
