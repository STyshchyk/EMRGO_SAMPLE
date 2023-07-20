import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/notification";

const defaultState = {
  notificationData: [],
  isFetching: true,
  isSettingRead: false,
  isNotificationSocketOpen: false,
  message: {},
};

const notificationReducer = handleActions(
  {
    [actionCreators.doFetchNotificationRequest]: produce((draft) => {
      draft.isFetching = true;
    }),
    [actionCreators.doFetchNotificationSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.notificationData = data.notifications;
    }),
    [actionCreators.doFetchNotificationFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.message = payload;
    }),
    [actionCreators.doNotificationSetReadRequest]: produce((draft) => {
      draft.isSettingRead = true;
    }),
    [actionCreators.doNotificationSetReadSuccess]: produce((draft) => {
      draft.isSettingRead = false;
    }),
    [actionCreators.doNotificationSetReadFailure]: produce((draft) => {
      draft.isSettingRead = false;
    }),
    [actionCreators.doOpenNotificationSocketRequest]: produce((draft) => {
      draft.isNotificationSocketOpen = false;
    }),
    [actionCreators.doOpenNotificationSocketSuccess]: produce((draft, { payload }) => {
      draft.isNotificationSocketOpen = true;
      draft.notificationData.push(payload);
    }),
    [actionCreators.doOpenNotificationSocketFailure]: produce((draft) => {
      draft.isNotificationSocketOpen = false;
    }),
  },
  defaultState
);

export default notificationReducer;
