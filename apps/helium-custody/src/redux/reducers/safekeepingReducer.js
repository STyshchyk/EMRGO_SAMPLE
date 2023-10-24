import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/safekeeping";

const defaultState = {
  errorMessage: null,
  isFetching: false,
  isRequesting: false,
  isSubmitting: false,
  message: null,
  accounts: [],
};

const safekeepingReducer = handleActions(
  {
    [actionCreators.doReadAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doReadAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.accounts = data.data;
    }),
    [actionCreators.doReadAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doCreateAccount]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doCreateAccountSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doCreateAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateAccount]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doUpdateAccountSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doUpdateAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default safekeepingReducer;
