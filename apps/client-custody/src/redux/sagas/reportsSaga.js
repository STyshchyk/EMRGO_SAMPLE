import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as actionCreators from "../actionCreators/reports";
import * as actionTypes from "../actionTypes/reports";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchCashAccounts({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getCashAccounts, payload);
    const { data } = response;
    yield put(actionCreators.doFetchCashAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchCashAccountsFailure(errorMessage));
  }
}

function* fetchCashTransations({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getCashTransactions, payload);
    const { data } = response;
    yield put(actionCreators.doFetchCashTransactionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchCashTransactionsFailure(errorMessage));
  }
}

function* fetchCashBalances({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getCashBalances, payload);
    const { data } = response;
    yield put(actionCreators.doFetchCashBalancesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchCashBalancesFailure(errorMessage));
  }
}

function* fetchSecuritesAccounts({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getSecuritiesAccounts, payload);
    const { data } = response;
    yield put(actionCreators.doFetchSecuritiesAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSecuritiesAccountsFailure(errorMessage));
  }
}

function* fetchSafeAccounts({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getSafeAccounts, payload);
    const { data } = response;
    yield put(actionCreators.doFetchSafeAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSafeAccountsFailure(errorMessage));
  }
}

function* fetchSecuritiesTransations({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getSecuritiesTransactions, payload);
    const { data } = response;
    yield put(actionCreators.doFetchSecuritiesTransactionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSecuritiesTransactionsFailure(errorMessage));
  }
}

function* fetchSecuritiesHoldings({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getSecuritiesHoldings, payload);
    const { data } = response;
    yield put(actionCreators.doFetchSecuritiesHoldingsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSecuritiesHoldingsFailure(errorMessage));
  }
}

function* fetchTradeDatedSecuritiesHoldings({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.reportsAPI.getTradeDateSecuritiesHoldings,
      payload
    );
    const { data } = response;
    yield put(actionCreators.doFetchTradeDatedSecuritiesHoldingsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchTradeDatedSecuritiesHoldingsFailure(errorMessage));
  }
}

function* fetchReferenceData({ payload }) {
  try {
    const response = yield call(wethaqAPIService.reportsAPI.getReferenceData, payload);
    const { data } = response;
    yield put(actionCreators.doFetchReferenceDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchReferenceDataFailure(errorMessage));
  }
}

const reportsSaga = [
  takeLatest(actionTypes.FETCH_CASH_ACCOUNTS_REQUESTED, fetchCashAccounts),
  takeLatest(actionTypes.FETCH_SAFE_ACCOUNTS_REQUESTED, fetchSafeAccounts),
  takeLatest(actionTypes.FETCH_CASH_TRANSACTIONS_REQUESTED, fetchCashTransations),
  takeLatest(actionTypes.FETCH_CASH_BALANCES_REQUESTED, fetchCashBalances),
  takeLatest(actionTypes.FETCH_SECURITIES_ACCOUNTS_REQUESTED, fetchSecuritesAccounts),
  takeLatest(actionTypes.FETCH_SECURITIES_TRANSACTIONS_REQUESTED, fetchSecuritiesTransations),
  takeLatest(actionTypes.FETCH_SECURITIES_HOLDINGS_REQUESTED, fetchSecuritiesHoldings),
  takeLatest(
    actionTypes.FETCH_TRADE_DATED_SECURITIES_HOLDINGS_REQUESTED,
    fetchTradeDatedSecuritiesHoldings
  ),
  takeLatest(actionTypes.FETCH_REFERENCE_DATA_REQUESTED, fetchReferenceData),
];

export default reportsSaga;
