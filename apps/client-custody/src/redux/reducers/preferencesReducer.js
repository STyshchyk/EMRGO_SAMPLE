import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as preferencesActionCreators from '../actionCreators/preferences';

const defaultState = {
  data: {
    preferences: null,
  },
  errorMessage: null,
  isFetching: false,
};

const preferencesReducer = handleActions(
  {
    [preferencesActionCreators.doFetchPreferences]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [preferencesActionCreators.doFetchPreferencesSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.data = data;
    }),
    [preferencesActionCreators.doFetchPreferencesFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default preferencesReducer;
