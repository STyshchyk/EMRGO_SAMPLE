import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/sukuk";

const defaultState = {
  isLoading: false,
  message: null,
  sukukOverviewData: {},
};

const sukukReducer = handleActions(
  {
    [actionCreators.doSetupProject]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doFetchSukukOverviewData]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doSetupProjectSuccess]: produce((draft, { payload: { message } }) => {
      draft.isLoading = false;
      draft.message = message;
    }),
    [actionCreators.doFetchSukukOverviewDataSuccess]: produce(
      (draft, { payload: { sukukOverview } }) => {
        draft.isLoading = false;
        draft.sukukOverviewData = sukukOverview;
      }
    ),
    [actionCreators.doSetupProjectFailure]: produce((draft, { payload }) => {
      draft.isLoading = false;
      draft.message = payload;
    }),
    [actionCreators.doFetchSukukOverviewDataFailure]: produce((draft, { payload }) => {
      draft.isLoading = false;
      draft.message = payload;
    }),
    [actionCreators.doResetSukukOverviewData]: produce((draft) => {
      draft.sukukOverviewData = {};
    }),
  },
  defaultState
);

export default sukukReducer;
