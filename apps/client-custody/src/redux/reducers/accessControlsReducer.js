import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as accessControlsActionCreators from '../actionCreators/accessControls';

const defaultState = {
  data: {
    accessControls: null,
  },
  errorMessage: null,
  isFetching: false,
};

const accessControlsReducer = handleActions(
  {
    [accessControlsActionCreators.doFetchAccessControls]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [accessControlsActionCreators.doFetchAccessControlsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.data = data;
    }),
    [accessControlsActionCreators.doFetchAccessControlsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [accessControlsActionCreators.doResetAccessControlsState]: produce((draft) => {
      draft.data = {
        accessControls: null,
      };
    }),
  },
  defaultState,
);

export default accessControlsReducer;
