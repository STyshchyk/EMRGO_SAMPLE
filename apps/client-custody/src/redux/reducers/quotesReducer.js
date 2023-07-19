import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/quotes';

const defaultState = {
  quotes: [],
  isLoading: false,
  errorMessage: null,
};

const quotesReducer = handleActions(
  {
    [actionCreators.doCreateQuoteRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),

    [actionCreators.doCreateQuoteSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doCreateQuoteFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doReadQuoteRequest]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doReadQuoteSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        },
      ) => {
        draft.quotes = data;
        draft.isLoading = false;
      },
    ),
    [actionCreators.doReadQuoteFailure]: produce((draft, { message }) => {
      draft.message = message;
      draft.isLoading = false;
    }),

    [actionCreators.doUpdateQuoteRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateQuoteSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateQuoteFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doDeleteQuoteRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doDeleteQuoteSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doDeleteQuoteFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
  },
  defaultState,
);

export default quotesReducer;
