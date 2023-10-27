import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as actionCreators from "../actionCreators/cashManagement";
import * as actionTypes from "../actionTypes/cashManagement";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchTransations({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getTransactions, payload);
    const { data } = response;
    yield put(actionCreators.doFetchTransactionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchTransactionsFailure(errorMessage));
  }
}

function* fetchAccounts({ payload }) {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getAccounts, payload);
    const { data } = response;
    yield put(actionCreators.doFetchAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchAccountsFailure(errorMessage));
  }
}

function* fetchEmrgoOwners() {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getEmrgoOwners);
    const { data } = response;
    yield put(actionCreators.doFetchEmrgoOwnersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    console.log("saga error", error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchEmrgoOwnersFailure(errorMessage));
  }
}

function* fetchSourceOwners() {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getOwners);
    const { data } = response;
    yield put(actionCreators.doFetchSourceOwnersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSourceOwnersFailure(errorMessage));
  }
}

function* fetchDestinationOwners() {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getOwners);
    const { data } = response;
    yield put(actionCreators.doFetchDestinationOwnersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(actionCreators.doFetchDestinationOwnersFailure(errorMessage));
  }
}

function* fetchSourceAccounts() {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getAccounts);
    const { data } = response;
    yield put(actionCreators.doFetchSourceAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSourceAccountsFailure(errorMessage));
  }
}

function* doFetchDestinationAccounts() {
  try {
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.getAccounts);
    const { data } = response;
    yield put(actionCreators.doFetchDestinationAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchDestinationAccountsFailure(errorMessage));
  }
}

function* doMoneyTransfer({ payload }) {
  try {
    const { cb, ...otherKeys } = payload;
    const response = yield call(wethaqAPIService.billingAndPaymentsAPI.transferMoney, otherKeys);
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    if (cb) {
      cb();
    }
    yield put(actionCreators.doMoneyTransferSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doMoneyTransferFailure(errorMessage));
  }
}

function* fetchDropdowns({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(actionCreators.doFetchDropdownValuesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchDropdownValuesFailure(errorMessage));
  }
}

function* createAccount({ payload }) {
  try {
    const { cb, requestPayload } = payload;
    const response = yield call(wethaqAPIService.accountsAPI.addAccount, requestPayload);
    const { data } = response;
    yield put(actionCreators.doCreateAccountSuccess({ data }));
    cb();
    yield put(actionCreators.doFetchAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doCreateAccountFailure(errorMessage));
  }
}

function* editAccount({ payload }) {
  try {
    const { cb } = payload;
    const response = yield call(wethaqAPIService.accountsAPI.editAccount, payload);
    const { data } = response;
    yield put(actionCreators.doEditAccountSuccess({ data }));
    cb();
    yield put(actionCreators.doFetchAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doEditAccountFailure(errorMessage));
  }
}

function* fetchUnallocatedTransactions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.fetchUnallocatedTransactions, payload);
    const { data } = response;
    yield put(actionCreators.doFetchUnallocatedTransactionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchUnallocatedTransactionsFailure(errorMessage));
  }
}

function* updateUnallocatedTransactions({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.accountsAPI.updateUnallocatedTransactions,
      payload
    );
    const { data } = response;
    yield put(actionCreators.doUpdateUnallocatedTransactionsSuccess({ data }));
    yield put(actionCreators.doFetchUnallocatedTransactions());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doUpdateUnallocatedTransactionsFailure(errorMessage));
  }
}

function* doMoneyTransferInternal({ payload }) {
  try {
    const { cb, ...otherKeys } = payload;
    const response = yield call(
      wethaqAPIService.billingAndPaymentsAPI.transferMoneyInternal,
      payload
    );
    const { data } = response;
    yield call(toast.success, data.message, { autoClose: 5000 });
    yield put(actionCreators.doMoneyTransferInternalSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doMoneyTransferInternalFailure(errorMessage));
  }
}

function* fetchExternalPaymentsAuditData({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.billingAndPaymentsAPI.getExternalPaymentsAuditDataById,
      payload
    );
    const { data } = response;

    yield put(actionCreators.doFetctExternalPaymentsAuditDataSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetctExternalPaymentsAuditDataFailure(errorMessage));
  }
}

const billingAndPaymentsSaga = [
  takeLatest(actionTypes.FETCH_TRANSACTIONS_REQUESTED, fetchTransations),
  takeLatest(actionTypes.FETCH_ACCOUNTS_REQUESTED, fetchAccounts),
  takeLatest(actionTypes.FETCH_SOURCE_OWNERS_REQUESTED, fetchSourceOwners),
  takeLatest(actionTypes.FETCH_EMRGO_OWNERS_REQUESTED, fetchEmrgoOwners),
  takeLatest(actionTypes.FETCH_DESTINATION_OWNERS_REQUESTED, fetchDestinationOwners),
  takeLatest(actionTypes.FETCH_SOURCE_ACCOUNTS_REQUESTED, fetchSourceAccounts),
  takeLatest(actionTypes.FETCH_DESTINATION_ACCOUNTS_REQUESTED, doFetchDestinationAccounts),
  takeLatest(actionTypes.MONEY_TRANSFER_REQUESTED, doMoneyTransfer),
  takeLatest(actionTypes.MONEY_TRANSFER_INTERNAL_REQUESTED, doMoneyTransferInternal),
  takeLatest(actionTypes.FETCH_DROPDOWN_VALUES_REQUESTED, fetchDropdowns),
  takeLatest(actionTypes.CREATE_ACCOUNT_REQUESTED, createAccount),
  takeLatest(actionTypes.EDIT_ACCOUNT_REQUESTED, editAccount),
  takeLatest(
    actionTypes.FETCH_UNALLOCATED_INCOMING_TRANSACTIONS_REQUESTED,
    fetchUnallocatedTransactions
  ),
  takeLatest(
    actionTypes.UPDATE_UNALLOCATED_INCOMING_TRANSACTIONS_REQUESTED,
    updateUnallocatedTransactions
  ),
  takeLatest(
    actionTypes.FETCH_EXTERNAL_PAYMENTS_AUDIT_DATA_REQUESTED,
    fetchExternalPaymentsAuditData
  ),
];

export default billingAndPaymentsSaga;
