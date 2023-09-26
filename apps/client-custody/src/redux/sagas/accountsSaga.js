import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import i18n from "../../i18n";
import * as s3Service from "../../services/s3Service";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as accountsActionCreators from "../actionCreators/accounts";
import * as accountsActionTypes from "../actionTypes/accounts";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchAccountsSaga() {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.getAccounts);
    const { data } = response;
    yield put(accountsActionCreators.doFetchAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doFetchAccountsFailure(errorMessage));
  }
}

function* addAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.addAccount, payload);
    const { data } = response;
    yield put(accountsActionCreators.doAddAccountSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error);
    yield put(accountsActionCreators.doAddAccountFailure(errorMessage));
  }
}

function* editAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.editAccount, payload);
    const { data } = response;
    yield put(accountsActionCreators.doEditAccountSuccess({ data }));
    yield put(accountsActionCreators.doFetchAccounts());
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doEditAccountFailure(errorMessage));
  }
}

function* deleteAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.deleteAccount, payload);
    const { data } = response;
    yield put(accountsActionCreators.doDeleteAccountSuccess({ data }));
    yield put(accountsActionCreators.doFetchAccounts());
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doDeleteAccountFailure(errorMessage));
  }
}

function* fetchPaymentAccountsSaga() {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.getPaymentAccounts);
    const { data } = response;
    yield put(accountsActionCreators.doFetchPaymentAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doFetchPaymentAccountsFailure(errorMessage));
  }
}

function* addPaymentAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.addPaymentAccount, payload?.requestPayload);
    const { data } = response;
    yield put(accountsActionCreators.doAddPaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchPaymentAccounts());
    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doAddPaymentAccountFailure(errorMessage));
  }
}

function* editPaymentAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.editPaymentAccount, payload);
    const { data } = response;
    yield put(accountsActionCreators.doEditPaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchPaymentAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doEditPaymentAccountFailure(errorMessage));
  }
}

function* deletePaymentAccountSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.deletePaymentAccount, payload);
    const { data } = response;
    yield put(accountsActionCreators.doDeletePaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchPaymentAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doDeletePaymentAccountFailure(errorMessage));
  }
}

function* setPaymentAccountAsDefault({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.setPaymentAccountAsDefault, payload);
    const { data } = response;
    yield put(accountsActionCreators.doSetPaymentAccountAsDefaultSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchPaymentAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doSetPaymentAccountAsDefaultFailure(errorMessage));
  }
}

function* validatePaymentAccount({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.validatePaymentAccount, payload);
    const { data } = response;
    yield put(accountsActionCreators.doValidatePaymentAccountSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchPaymentAccounts());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doValidatePaymentAccountFailure(errorMessage));
  }
}

function* uploadSupportingDocFileForPaymentAccount({ payload }) {
  try {
    const response = yield call(wethaqAPIService.fileAPI.upload, payload.requestPayload);
    const { data } = response;

    data.name = payload.requestPayload.name;
    data.keyName = payload.keyName;

    const fileName = payload.requestPayload.originalFileName;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t("messages:Uploaded")} ${fileName}`);
    yield put(accountsActionCreators.doUploadSupportingDocumentForPaymentAccountSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      accountsActionCreators.doUploadSupportingDocumentForPaymentAccountFailure({
        message: errorMessage,
        key: payload.keyName,
      })
    );
  }
}

function* fetchValidatedAccounts({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.getValidatedAccounts, payload);
    const { data } = response;
    yield put(accountsActionCreators.doFetchValidatedAccountsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doFetchValidatedAccountsFailure(errorMessage));
  }
}

function* uploadAccountFile({ payload }) {
  try {
    const params = {
      requestPayload: payload.requestPayload,
    };
    const response = yield call(wethaqAPIService.accountsAPI.uploadAccountFile, params);
    const { data } = response;
    data.keyName = payload.keyName;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t("messages:Uploaded")} ${payload.requestPayload.fileName}`);
    yield put(accountsActionCreators.doUploadAccountFileSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      accountsActionCreators.doUploadAccountFileFailure({
        message: errorMessage,
        key: payload.keyName || payload.name,
      })
    );
  }
}

function* updateInvestorPayment({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.updateInvestorPayment, payload);
    const { data } = response;
    yield put(accountsActionCreators.doUpdateInvestorPaymentSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doUpdateInvestorPaymentFailure(errorMessage));
  }
}

function* fetchInvestorPayment({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.fetchInvestorPayment, payload);
    const { data } = response;
    yield put(accountsActionCreators.doFetchInvestorPaymentSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doFetchInvestorPaymentFailure(errorMessage));
  }
}

function* fetchUploadedSupportingDocumentFile({ payload }) {
  const key = payload.fileName;
  try {
    const response = yield call(wethaqAPIService.fileAPI.download, payload);
    const { data } = response;
    data.fileName = key;
    window.open(data.link);
    yield put(accountsActionCreators.doFetchUploadedSupportingDocumentFileSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      accountsActionCreators.doFetchUploadedSupportingDocumentFileFailure({
        message: errorMessage,
        key,
      })
    );
  }
}

function* fetchOutgoingInstructions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.fetchOutgoingInstructions, payload);
    const { data } = response;
    yield put(accountsActionCreators.doFetchOutgoingInstructionsSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doFetchOutgoingInstructionsFailure(errorMessage));
  }
}

function* createOutgoingInstructions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.createOutgoingInstructions, payload);
    const { data } = response;
    yield put(accountsActionCreators.doFetchOutgoingInstructions());
    yield put(accountsActionCreators.doCreateOutgoingInstructionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doCreateOutgoingInstructionsFailure(errorMessage));
  }
}

function* approveOutgoingPaymentInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.accountsAPI.approveOutgoingPaymentByInstructionID,
      payload
    );
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchOutgoingInstructions());
    yield put(accountsActionCreators.doApproveOutgoingPaymentInstructionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doApproveOutgoingPaymentInstructionFailure(errorMessage));
  }
}

function* finalizeOutgoingPaymentInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.accountsAPI.finalizeOutgoingPaymentByInstructionID,
      payload
    );
    const { data } = response;
    yield put(accountsActionCreators.doFetchOutgoingInstructions());
    yield put(accountsActionCreators.doFinalizeOutgoingPaymentInstructionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    // showToastErrorNotification(error, errorMessage);
    toast.error(errorMessage); // One time code is not valid has status 401 which is an exception in showToastErrorNotification()
    yield put(accountsActionCreators.doFinalizeOutgoingPaymentInstructionFailure(errorMessage));
  }
}

function* updateOutgoingPaymentInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.accountsAPI.updateOutgoingPaymentByInstructionID,
      payload
    );
    const { data } = response;
    yield put(accountsActionCreators.doFetchOutgoingInstructions());
    yield put(accountsActionCreators.doUpdateOutgoingPaymentInstructionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doUpdateOutgoingPaymentInstructionFailure(errorMessage));
  }
}

function* clientApproveOutgoingPaymentInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.accountsAPI.clientAproveOutgoingPaymentByInstructionID,
      payload
    );
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(accountsActionCreators.doFetchOutgoingInstructions());
    yield put(accountsActionCreators.doClientApproveOutgoingPaymentInstructionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(
      accountsActionCreators.doClientApproveOutgoingPaymentInstructionFailure(errorMessage)
    );
  }
}

function* fetchReconciledTransactions() {
  try {
    const response = yield call(wethaqAPIService.accountsAPI.fetchReconciledTransactions);
    const { data } = response;
    yield put(accountsActionCreators.doFetchReconciledTransactionsSuccess({ data }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accountsActionCreators.doFetchReconciledTransactionsFailure(errorMessage));
  }
}

// PAYMENT_ACCOUNTS_FETCH_RECONCILED_TRANSACTIONS_REQUESTED
const accountsSaga = [
  takeLatest(accountsActionTypes.ACCOUNTS_ADD_REQUESTED, addAccountSaga),
  takeLatest(accountsActionTypes.ACCOUNTS_FETCH_REQUESTED, fetchAccountsSaga),
  takeLatest(accountsActionTypes.ACCOUNTS_EDIT_REQUESTED, editAccountSaga),
  takeLatest(accountsActionTypes.ACCOUNTS_DELETE_REQUESTED, deleteAccountSaga),
  takeLatest(accountsActionTypes.PAYMENT_ACCOUNTS_FETCH_REQUESTED, fetchPaymentAccountsSaga),
  takeLatest(accountsActionTypes.PAYMENT_ACCOUNTS_ADD_REQUESTED, addPaymentAccountSaga),
  takeLatest(accountsActionTypes.PAYMENT_ACCOUNTS_EDIT_REQUESTED, editPaymentAccountSaga),
  takeLatest(accountsActionTypes.PAYMENT_ACCOUNTS_DELETE_REQUESTED, deletePaymentAccountSaga),
  takeLatest(
    accountsActionTypes.PAYMENT_ACCOUNTS_SET_AS_DEFAULT_REQUESTED,
    setPaymentAccountAsDefault
  ),
  takeLatest(accountsActionTypes.PAYMENT_ACCOUNTS_VALIDATE_REQUESTED, validatePaymentAccount),
  takeLatest(
    accountsActionTypes.PAYMENT_ACCOUNTS_UPLOAD_SUPPORTING_DOC_FILE_REQUESTED,
    uploadSupportingDocFileForPaymentAccount
  ),
  takeLatest(accountsActionTypes.VALIDATED_ACCOUNTS_FETCH_REQUESTED, fetchValidatedAccounts),
  takeLatest(accountsActionTypes.ACCOUNT_FILE_UPLOAD_REQUESTED, uploadAccountFile),
  takeLatest(accountsActionTypes.UPDATE_INVESTOR_PAYMENT_REQUESTED, updateInvestorPayment),
  takeLatest(accountsActionTypes.FETCH_INVESTOR_PAYMENT_REQUESTED, fetchInvestorPayment),
  takeLatest(
    accountsActionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_REQUESTED,
    fetchUploadedSupportingDocumentFile
  ),
  takeLatest(accountsActionTypes.FETCH_OUTGOING_INSTRUCTIONS_REQUESTED, fetchOutgoingInstructions),
  takeLatest(
    accountsActionTypes.CREATE_OUTGOING_INSTRUCTIONS_REQUESTED,
    createOutgoingInstructions
  ),
  takeLatest(
    accountsActionTypes.APPROVE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED,
    approveOutgoingPaymentInstruction
  ),
  takeLatest(
    accountsActionTypes.FINALIZE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED,
    finalizeOutgoingPaymentInstruction
  ),
  takeLatest(
    accountsActionTypes.UPDATE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED,
    updateOutgoingPaymentInstruction
  ),
  takeLatest(
    accountsActionTypes.CLIENT_APPROVE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED,
    clientApproveOutgoingPaymentInstruction
  ),
  takeLatest(
    accountsActionTypes.PAYMENT_ACCOUNTS_FETCH_RECONCILED_TRANSACTIONS_REQUESTED,
    fetchReconciledTransactions
  ),
];

export default accountsSaga;
