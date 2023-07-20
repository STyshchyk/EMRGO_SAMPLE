import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/billing";

export const doReadRatecardsRequest = createAction(actionTypes.READ_RATECARDS_REQUESTED);
export const doReadRatecardsSuccess = createAction(actionTypes.READ_RATECARDS_SUCCEEDED);
export const doReadRatecardsFailure = createAction(actionTypes.READ_RATECARDS_FAILED);

export const doReadRatecardRequest = createAction(actionTypes.READ_RATECARD_REQUESTED);
export const doReadRatecardSuccess = createAction(actionTypes.READ_RATECARD_SUCCEEDED);
export const doReadRatecardFailure = createAction(actionTypes.READ_RATECARD_FAILED);

export const doCreateRatecardRequest = createAction(actionTypes.CREATE_RATECARD_REQUESTED);
export const doCreateRatecardSuccess = createAction(actionTypes.CREATE_RATECARD_SUCCEEDED);
export const doCreateRatecardFailure = createAction(actionTypes.CREATE_RATECARD_FAILED);

export const doUpdateRatecardRequest = createAction(actionTypes.UPDATE_RATECARD_REQUESTED);
export const doUpdateRatecardSuccess = createAction(actionTypes.UPDATE_RATECARD_SUCCEEDED);
export const doUpdateRatecardFailure = createAction(actionTypes.UPDATE_RATECARD_FAILED);

export const doApproveRatecardRequest = createAction(actionTypes.APPROVE_RATECARD_REQUESTED);
export const doApproveRatecardSuccess = createAction(actionTypes.APPROVE_RATECARD_SUCCEEDED);
export const doApproveRatecardFailure = createAction(actionTypes.APPROVE_RATECARD_FAILED);

// INVOICES
export const doReadInvoicesRequest = createAction(actionTypes.READ_INVOICES_REQUESTED);
export const doReadInvoicesSuccess = createAction(actionTypes.READ_INVOICES_SUCCEEDED);
export const doReadInvoicesFailure = createAction(actionTypes.READ_INVOICES_FAILED);

export const doReadInvoiceRequest = createAction(actionTypes.READ_INVOICE_REQUESTED);
export const doReadInvoiceSuccess = createAction(actionTypes.READ_INVOICE_SUCCEEDED);
export const doReadInvoiceFailure = createAction(actionTypes.READ_INVOICE_FAILED);

export const doCalculateInvoiceRequest = createAction(actionTypes.CALCULATE_INVOICE_REQUESTED);
export const doCalculateInvoiceSuccess = createAction(actionTypes.CALCULATE_INVOICE_SUCCEEDED);
export const doCalculateInvoiceFailure = createAction(actionTypes.CALCULATE_INVOICE_FAILED);
export const doCalculateInvoiceReset = createAction(actionTypes.CALCULATE_INVOICE_RESET);

export const doUpdateInvoiceRequest = createAction(actionTypes.UPDATE_INVOICE_REQUESTED);
export const doUpdateInvoiceSuccess = createAction(actionTypes.UPDATE_INVOICE_SUCCEEDED);
export const doUpdateInvoiceFailure = createAction(actionTypes.UPDATE_INVOICE_FAILED);

export const doApproveInvoiceRequest = createAction(actionTypes.APPROVE_INVOICE_REQUESTED);
export const doApproveInvoiceSuccess = createAction(actionTypes.APPROVE_INVOICE_SUCCEEDED);
export const doApproveInvoiceFailure = createAction(actionTypes.APPROVE_INVOICE_FAILED);
