import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as actionCreators from "../actionCreators/safekeeping";
import * as actionTypes from "../actionTypes/safekeeping";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* readAccounts({ payload }) {
  try {
    const response = yield call(wethaqAPIService.safekeepingAPI.readAccounts, payload);
    const { data } = response;
    yield put(actionCreators.doReadAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doReadAccountsFailure(errorMessage));
  }
}

function* createAccount({ payload }) {
  try {
    
    const response = yield call(wethaqAPIService.safekeepingAPI.createAccount, payload);
    const { data } = response;
    yield put(actionCreators.doCreateAccountSuccess({ data }));
    yield put(actionCreators.doReadAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doCreateAccountFailure(errorMessage));
  }
}

function* updateAccount({ payload }) {
  try {
    const response = yield call(wethaqAPIService.safekeepingAPI.updateAccount, payload);
    const { data } = response;
    yield put(actionCreators.doUpdateAccountSuccess({ data }));
    yield put(actionCreators.doReadAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doUpdateAccountFailure(errorMessage));
  }
}

const safekeepingSaga = [
  takeLatest(actionTypes.READ_ACCOUNTS_REQUESTED, readAccounts),
  takeLatest(actionTypes.CREATE_ACCOUNT_REQUESTED, createAccount),
  takeLatest(actionTypes.UPDATE_ACCOUNT_REQUESTED, updateAccount),
];

export default safekeepingSaga;
