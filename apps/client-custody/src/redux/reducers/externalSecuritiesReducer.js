import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as externalSecuritiesActionCreators from "../actionCreators/externalSecurities";

const defaultState = {
  externalSecuritiesData: [],
  externalSecurities: {},
  errorMessage: null,
  isRequesting: false,
  isFetching: false,
  message: null,
  isLoading: false,
  listOfExternalSecuritySearchResults: [],
};

const externalSecuritiesReducer = handleActions(
  {
    [externalSecuritiesActionCreators.doFetchExternalSecuritiesList]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [externalSecuritiesActionCreators.doFetchExternalSecuritiesListSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.externalSecuritiesData = data;
        draft.isFetching = false;
      }
    ),
    [externalSecuritiesActionCreators.doFetchExternalSecuritiesListFailure]: produce(
      (draft, { payload }) => {
        draft.isFetching = false;
        draft.errorMessage = payload;
      }
    ),
    [externalSecuritiesActionCreators.doAddExternalSecurities]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [externalSecuritiesActionCreators.doAddExternalSecuritiesSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
      }
    ),
    [externalSecuritiesActionCreators.doAddExternalSecuritiesFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),
    [externalSecuritiesActionCreators.doEditExternalSecurities]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [externalSecuritiesActionCreators.doEditExternalSecuritiesSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [externalSecuritiesActionCreators.doEditExternalSecuritiesFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),
    [externalSecuritiesActionCreators.doDeleteExternalSecurities]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [externalSecuritiesActionCreators.doDeleteExternalSecuritiesSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [externalSecuritiesActionCreators.doDeleteExternalSecuritiesFailure]: produce(
      (draft, { message }) => {
        draft.isRequesting = false;
        draft.errorMessage = message;
      }
    ),
    [externalSecuritiesActionCreators.doSearchExternalSecurities]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [externalSecuritiesActionCreators.doSearchExternalSecuritiesSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.listOfExternalSecuritySearchResults = data;
        draft.isRequesting = false;
      }
    ),
    [externalSecuritiesActionCreators.doSearchExternalSecuritiesFailure]: produce(
      (draft, { message }) => {
        draft.isRequesting = false;
        draft.errorMessage = message;
      }
    ),

    [externalSecuritiesActionCreators.doResetExternalSecuritiesSearchResults]: produce((draft) => {
      draft.listOfExternalSecuritySearchResults = [];
    }),
  },
  defaultState
);

export default externalSecuritiesReducer;
