import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/form';

const defaultState = {
  errorMessage: null,
  isFetching: false,
  formValues: null,
  isPosted: null,
};

const formValuesReducer = handleActions(
  {
    [actionCreators.doFetchForm]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchFormSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.formValues = data;
    }),
    [actionCreators.doPostFormSuccess]: produce((draft, { payload: { data } }) => {
      draft.isPosted = true;
      draft.formValues = data;
    }),
    [actionCreators.doFetchFormFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default formValuesReducer;
