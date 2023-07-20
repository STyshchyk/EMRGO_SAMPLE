import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/users";

const defaultState = {
  errorMessage: {},
  isSubmitting: false,
  message: {},
};

const usersReducer = handleActions(
  {
    [actionCreators.doUpdateUserAccountStatus]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateUserAccountStatusSuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doUpdateUserAccountStatusFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default usersReducer;
