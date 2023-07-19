import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import * as actionCreators from '../actionCreators/billing';
import * as actionTypes from '../actionTypes/billing';
import * as wethaqAPIService from '../../services/wethaqAPIService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchRateCards({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.fetchRateCards, payload);
    const { data } = response;
    yield put(actionCreators.doReadRatecardsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doReadRatecardsFailure(errorMessage));
  }
}

function* fetchRateCard({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.fetchRateCard, payload);
    const { data } = response;
    yield put(actionCreators.doReadRatecardSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doReadRatecardFailure(errorMessage));
  }
}

function* createRateCard({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.createRateCard, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(actionCreators.doCreateRatecardSuccess({ data }));
    yield put(actionCreators.doReadRatecardsRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doCreateRatecardFailure(errorMessage));
  }
}

function* updateRateCard({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.updateRateCard, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(actionCreators.doUpdateRatecardSuccess({ data }));
    yield put(actionCreators.doReadRatecardRequest({ clientRateCardId: payload?.clientRateCardId }));
    yield put(actionCreators.doReadRatecardsRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doUpdateRatecardFailure(errorMessage));
  }
}

function* approveRateCard({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.approveRateCard, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(actionCreators.doApproveRatecardSuccess({ data }));
    yield put(actionCreators.doReadRatecardRequest({ clientRateCardId: payload?.clientRateCardId }));
    yield put(actionCreators.doReadRatecardsRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doApproveRatecardFailure(errorMessage));
  }
}

// INVOICES
function* fetchInvoices({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.fetchInvoices, payload);
    const { data } = response;
    yield put(actionCreators.doReadInvoicesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doReadInvoicesFailure(errorMessage));
  }
}

function* fetchInvoice({ payload }) {
  try {
    // Use DB source for calculated value when invoice is fetched
    yield put(actionCreators.doCalculateInvoiceReset());
    const response = yield call(wethaqAPIService.billingAPI.fetchInvoice, payload);
    const { data } = response;
    yield put(actionCreators.doReadInvoiceSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doReadInvoiceFailure(errorMessage));
  }
}

function* calculateInvoice({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.calculateInvoice, payload);
    const { data } = response;
    yield put(actionCreators.doCalculateInvoiceSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doCalculateInvoiceFailure(errorMessage));
  }
}

function* updateInvoice({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.updateInvoice, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(actionCreators.doUpdateInvoiceSuccess({ data }));
    yield put(actionCreators.doReadInvoiceRequest({ invoiceId: payload?.invoiceId }));
    yield put(actionCreators.doReadInvoicesRequest({ params: payload?.fetchInvoiceParams }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doUpdateInvoiceFailure(errorMessage));
  }
}

function* approveInvoice({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAPI.approveInvoice, payload);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(actionCreators.doApproveInvoiceSuccess({ data }));
    yield put(actionCreators.doReadInvoiceRequest({ invoiceId: payload?.invoiceId }));
    yield put(actionCreators.doReadInvoicesRequest({ params: payload?.fetchInvoiceParams }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doApproveInvoiceFailure(errorMessage));
  }
}

const notificationSaga = [
  takeLatest(actionTypes.READ_RATECARDS_REQUESTED, fetchRateCards),
  takeLatest(actionTypes.READ_RATECARD_REQUESTED, fetchRateCard),
  takeLatest(actionTypes.CREATE_RATECARD_REQUESTED, createRateCard),
  takeLatest(actionTypes.UPDATE_RATECARD_REQUESTED, updateRateCard),
  takeLatest(actionTypes.APPROVE_RATECARD_REQUESTED, approveRateCard),

  // Invoices
  takeLatest(actionTypes.READ_INVOICES_REQUESTED, fetchInvoices),
  takeLatest(actionTypes.READ_INVOICE_REQUESTED, fetchInvoice),
  takeLatest(actionTypes.CALCULATE_INVOICE_REQUESTED, calculateInvoice),
  takeLatest(actionTypes.UPDATE_INVOICE_REQUESTED, updateInvoice),
  takeLatest(actionTypes.APPROVE_INVOICE_REQUESTED, approveInvoice),
];

export default notificationSaga;
