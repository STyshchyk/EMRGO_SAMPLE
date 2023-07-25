import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/notification";

export const doFetchNotificationRequest = createAction(
  actionTypes.NOTIFICATION_FETCH_ALL_REQUESTED
);
export const doFetchNotificationSuccess = createAction(
  actionTypes.NOTIFICATION_FETCH_ALL_SUCCEEDED
);
export const doFetchNotificationFailure = createAction(actionTypes.NOTIFICATION_FETCH_ALL_FAILED);

export const doNotificationSetReadRequest = createAction(
  actionTypes.NOTIFICATION_SET_READ_REQUESTED
);
export const doNotificationSetReadSuccess = createAction(
  actionTypes.NOTIFICATION_SET_READ_SUCCEEDED
);
export const doNotificationSetReadFailure = createAction(actionTypes.NOTIFICATION_SET_READ_FAILED);

export const doOpenNotificationSocketRequest = createAction(
  actionTypes.OPEN_NOTIFICATION_SOCKET_REQUESTED
);
export const doOpenNotificationSocketSuccess = createAction(
  actionTypes.OPEN_NOTIFICATION_SOCKET_SUCCEEDED
);
export const doOpenNotificationSocketFailure = createAction(
  actionTypes.OPEN_NOTIFICATION_SOCKET_FAILED
);
