import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/billing';

const defaultState = {
  isLoading: false,
  ratecards: [],
  currentRatecard: {},
  invoices: [],
  currentInvoice: {},
  errorMessage: null,
  calculatedTotalInvoiceAmount: null,
};

const billingReducer = handleActions(
  {
    [actionCreators.doReadRatecardsRequest]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doReadRatecardsSuccess]: produce((draft, { payload: { data } }) => {
      draft.ratecards = data || [];
      draft.isLoading = false;
    }),
    [actionCreators.doReadRatecardsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),

    [actionCreators.doReadRatecardRequest]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doReadRatecardSuccess]: produce((draft, { payload: { data } }) => {
      draft.currentRatecard = data;
      draft.isLoading = false;
    }),
    [actionCreators.doReadRatecardFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),

    [actionCreators.doCreateRatecardRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doCreateRatecardSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doCreateRatecardFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doUpdateRatecardRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateRatecardSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateRatecardFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doApproveRatecardRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doApproveRatecardSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doApproveRatecardFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    // INVOICES
    [actionCreators.doReadInvoicesRequest]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doReadInvoicesSuccess]: produce((draft, { payload: { data } }) => {
      draft.invoices = data || [];
      draft.isLoading = false;
    }),
    [actionCreators.doReadInvoicesFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),

    [actionCreators.doReadInvoiceRequest]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doReadInvoiceSuccess]: produce((draft, { payload: { data } }) => {
      draft.currentInvoice = data;
      draft.isLoading = false;
    }),
    [actionCreators.doReadInvoiceFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),

    [actionCreators.doCalculateInvoiceRequest]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doCalculateInvoiceSuccess]: produce((draft, { payload: { data } }) => {
      draft.calculatedTotalInvoiceAmount = data.amount;
      draft.isLoading = false;
    }),
    [actionCreators.doCalculateInvoiceFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),
    [actionCreators.doCalculateInvoiceReset]: produce((draft) => {
      draft.isLoading = false;
      draft.calculatedTotalInvoiceAmount = null;
    }),

    [actionCreators.doUpdateInvoiceRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateInvoiceSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateInvoiceFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doApproveInvoiceRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doApproveInvoiceSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doApproveInvoiceFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
  },
  defaultState,
);

export default billingReducer;
