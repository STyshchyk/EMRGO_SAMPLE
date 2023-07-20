import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as dropdownActionCreators from "../actionCreators/dropdown";

const defaultState = {
  errorMessage: null,
  isFetching: false,
  options: null,
};

const dropdownReducer = handleActions(
  {
    [dropdownActionCreators.doFetchDropdownOptions]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [dropdownActionCreators.doFetchDropdownOptionsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isFetching = false;
        draft.options = { ...draft.options, ...data };
      }
    ),
    [dropdownActionCreators.doFetchDropdownOptionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [dropdownActionCreators.doResetDropdownState]: produce((draft) => {
      draft.options = null;
    }),
  },
  defaultState
);

export default dropdownReducer;
