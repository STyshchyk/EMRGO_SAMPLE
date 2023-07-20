import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as CAEventsActionCreators from "../actionCreators/corporateActionEvents";

const defaultState = {
  corporateActionEventsData: [],
  isFetching: false,
  isRequesting: false,
  corporateActionEvent: {},
  isFetchingEvent: false,
};

const corporateActionEventsReducer = handleActions(
  {
    [CAEventsActionCreators.doFetchCAEvents]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [CAEventsActionCreators.doFetchCAEventsSuccess]: produce((draft, { payload: { data } }) => {
      draft.corporateActionEventsData = data.data;
      draft.isFetching = false;
    }),
    [CAEventsActionCreators.doFetchCAEventsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [CAEventsActionCreators.doSubmitClientResponse]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [CAEventsActionCreators.doSubmitClientResponseSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [CAEventsActionCreators.doSubmitClientResponseFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),

    [CAEventsActionCreators.doFetchCAEventbyId]: produce((draft) => {
      draft.isFetchingEvent = true;
      draft.errorMessage = null;
      draft.corporateActionEvent = {};
    }),
    [CAEventsActionCreators.doFetchCAEventbyIdSuccess]: produce((draft, { payload: { data } }) => {
      draft.corporateActionEvent = data.data;
      draft.isFetchingEvent = false;
    }),
    [CAEventsActionCreators.doFetchCAEventbyIdFailure]: produce((draft, { payload }) => {
      draft.isFetchingEvent = false;
      draft.errorMessage = payload;
    }),

    [CAEventsActionCreators.doResetCAEventState]: produce((draft) => {
      draft.corporateActionEvent = {};
    }),
  },
  defaultState
);

export default corporateActionEventsReducer;
