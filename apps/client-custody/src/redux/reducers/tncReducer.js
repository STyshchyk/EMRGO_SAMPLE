import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as tncActionCreators from "../actionCreators/tnc";

const defaultState = {
  tncData: null,
  tncStatus: null,
  isFetching: false,
  isRequesting: false,
  isSubmitting: false,
  message: null,
  errorMessage: null,
};

const tncReducer = handleActions(
  {
    [tncActionCreators.doFetchTermsData]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingTermsData = true;
    }),
    [tncActionCreators.doFetchTermsDataSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingTermsData = false;
      draft.tncData = data;
    }),
    [tncActionCreators.doFetchTermsDataFailure]: produce((draft, { payload }) => {
      draft.isFetchingTermsData = false;
      draft.errorMessage = payload;
    }),
    [tncActionCreators.doFetchTermsStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingTermsStatus = true;
    }),
    [tncActionCreators.doFetchTermsStatusSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingTermsStatus = false;
      draft.tncStatus = data;
    }),
    [tncActionCreators.doFetchTermsStatusFailure]: produce((draft, { payload }) => {
      draft.isFetchingTermsStatus = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default tncReducer;
