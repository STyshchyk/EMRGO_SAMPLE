import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as journalsActionCreators from '../actionCreators/journals';

const defaultState = {
  internalTransactionsData: [],
  data: {},
  errorMessage: null,
  isRequesting: false,
  isFetching: false,
  message: null,
  isLoading: false,
};

const fxTransactionsReducer = handleActions(
  {
    [journalsActionCreators.doFetchInternalTransactions]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [journalsActionCreators.doFetchInternalTransactionsSuccess]: produce((draft, { payload: { data } }) => {
      draft.internalTransactionsData = data?.data;
      draft.isFetching = false;
    }),
    [journalsActionCreators.doFetchInternalTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [journalsActionCreators.doUpdateInternalTransactions]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [journalsActionCreators.doUpdateInternalTransactionsSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [journalsActionCreators.doUpdateInternalTransactionsFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default fxTransactionsReducer;
