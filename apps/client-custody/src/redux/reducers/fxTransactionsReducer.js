import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as fxTransactionsActionCreators from '../actionCreators/fxTransactions';

const defaultState = {
  fxTransactionsData: [],
  data: {},
  errorMessage: null,
  isRequesting: false,
  isFetching: false,
  message: null,
  isLoading: false,
};

const fxTransactionsReducer = handleActions(
  {
    [fxTransactionsActionCreators.doFetchFxTransactions]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [fxTransactionsActionCreators.doFetchFxTransactionsSuccess]: produce((draft, { payload: { data } }) => {
      draft.fxTransactionsData = data;
      draft.isFetching = false;
    }),
    [fxTransactionsActionCreators.doFetchFxTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [fxTransactionsActionCreators.doAddFxTransactions]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [fxTransactionsActionCreators.doAddFxTransactionsSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [fxTransactionsActionCreators.doAddFxTransactionsFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [fxTransactionsActionCreators.doProcessFxTransactions]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [fxTransactionsActionCreators.doProcessFxTransactionsSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [fxTransactionsActionCreators.doProcessFxTransactionsFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default fxTransactionsReducer;
