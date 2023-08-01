import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/accounts";

export const doFetchAccounts = createAction(actionTypes.ACCOUNTS_FETCH_REQUESTED);
export const doFetchAccountsSuccess = createAction(actionTypes.ACCOUNTS_FETCH_SUCCEEDED);
export const doFetchAccountsFailure = createAction(actionTypes.ACCOUNTS_FETCH_FAILED);

export const doAddAccount = createAction(actionTypes.ACCOUNTS_ADD_REQUESTED);
export const doAddAccountSuccess = createAction(actionTypes.ACCOUNTS_ADD_SUCCEEDED);
export const doAddAccountFailure = createAction(actionTypes.ACCOUNTS_ADD_FAILED);

export const doEditAccount = createAction(actionTypes.ACCOUNTS_EDIT_REQUESTED);
export const doEditAccountSuccess = createAction(actionTypes.ACCOUNTS_EDIT_SUCCEEDED);
export const doEditAccountFailure = createAction(actionTypes.ACCOUNTS_EDIT_FAILED);

export const doDeleteAccount = createAction(actionTypes.ACCOUNTS_DELETE_REQUESTED);
export const doDeleteAccountSuccess = createAction(actionTypes.ACCOUNTS_DELETE_SUCCEEDED);
export const doDeleteAccountFailure = createAction(actionTypes.ACCOUNTS_DELETE_FAILED);

export const doFetchPaymentAccounts = createAction(actionTypes.PAYMENT_ACCOUNTS_FETCH_REQUESTED);
export const doFetchPaymentAccountsSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_SUCCEEDED
);
export const doFetchPaymentAccountsFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_FAILED
);

export const doAddPaymentAccount = createAction(actionTypes.PAYMENT_ACCOUNTS_ADD_REQUESTED);
export const doAddPaymentAccountSuccess = createAction(actionTypes.PAYMENT_ACCOUNTS_ADD_SUCCEEDED);
export const doAddPaymentAccountFailure = createAction(actionTypes.PAYMENT_ACCOUNTS_ADD_FAILED);

export const doEditPaymentAccount = createAction(actionTypes.PAYMENT_ACCOUNTS_EDIT_REQUESTED);
export const doEditPaymentAccountSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_EDIT_SUCCEEDED
);
export const doEditPaymentAccountFailure = createAction(actionTypes.PAYMENT_ACCOUNTS_EDIT_FAILED);

export const doDeletePaymentAccount = createAction(actionTypes.PAYMENT_ACCOUNTS_DELETE_REQUESTED);
export const doDeletePaymentAccountSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_DELETE_SUCCEEDED
);
export const doDeletePaymentAccountFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_DELETE_FAILED
);

export const doSetPaymentAccountAsDefault = createAction(
  actionTypes.PAYMENT_ACCOUNTS_SET_AS_DEFAULT_REQUESTED
);
export const doSetPaymentAccountAsDefaultSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_SET_AS_DEFAULT_SUCCEEDED
);
export const doSetPaymentAccountAsDefaultFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_SET_AS_DEFAULT_FAILED
);

export const doValidatePaymentAccount = createAction(
  actionTypes.PAYMENT_ACCOUNTS_VALIDATE_REQUESTED
);
export const doValidatePaymentAccountSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_VALIDATE_SUCCEEDED
);
export const doValidatePaymentAccountFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_VALIDATE_FAILED
);

export const doUploadSupportingDocumentForPaymentAccount = createAction(
  actionTypes.PAYMENT_ACCOUNTS_UPLOAD_SUPPORTING_DOC_FILE_REQUESTED
);
export const doUploadSupportingDocumentForPaymentAccountSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_UPLOAD_SUPPORTING_DOC_FILE_SUCCEEDED
);
export const doUploadSupportingDocumentForPaymentAccountFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_UPLOAD_SUPPORTING_DOC_FILE_FAILED
);

export const doFetchUploadedSupportingDocumentFile = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_REQUESTED
);
export const doFetchUploadedSupportingDocumentFileSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_SUCCEEDED
);
export const doFetchUploadedSupportingDocumentFileFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_FAILED
);

export const doFetchValidatedAccounts = createAction(
  actionTypes.VALIDATED_ACCOUNTS_FETCH_REQUESTED
);
export const doFetchValidatedAccountsSuccess = createAction(
  actionTypes.VALIDATED_ACCOUNTS_FETCH_SUCCEEDED
);
export const doFetchValidatedAccountsFailure = createAction(
  actionTypes.VALIDATED_ACCOUNTS_FETCH_FAILED
);

export const doUploadAccountFile = createAction(actionTypes.ACCOUNT_FILE_UPLOAD_REQUESTED);
export const doUploadAccountFileSuccess = createAction(actionTypes.ACCOUNT_FILE_UPLOAD_SUCCEEDED);
export const doUploadAccountFileFailure = createAction(actionTypes.ACCOUNT_FILE_UPLOAD_FAILED);

export const doUpdateInvestorPayment = createAction(actionTypes.UPDATE_INVESTOR_PAYMENT_REQUESTED);
export const doUpdateInvestorPaymentSuccess = createAction(
  actionTypes.UPDATE_INVESTOR_PAYMENT_SUCCEEDED
);
export const doUpdateInvestorPaymentFailure = createAction(
  actionTypes.UPDATE_INVESTOR_PAYMENT_FAILED
);

export const doFetchInvestorPayment = createAction(actionTypes.FETCH_INVESTOR_PAYMENT_REQUESTED);
export const doFetchInvestorPaymentSuccess = createAction(
  actionTypes.FETCH_INVESTOR_PAYMENT_SUCCEEDED
);
export const doFetchInvestorPaymentFailure = createAction(
  actionTypes.FETCH_INVESTOR_PAYMENT_FAILED
);

export const doFetchOutgoingInstructions = createAction(
  actionTypes.FETCH_OUTGOING_INSTRUCTIONS_REQUESTED
);
export const doFetchOutgoingInstructionsSuccess = createAction(
  actionTypes.FETCH_OUTGOING_INSTRUCTIONS_SUCCEEDED
);
export const doFetchOutgoingInstructionsFailure = createAction(
  actionTypes.FETCH_OUTGOING_INSTRUCTIONS_FAILED
);

export const doCreateOutgoingInstructions = createAction(
  actionTypes.CREATE_OUTGOING_INSTRUCTIONS_REQUESTED
);
export const doCreateOutgoingInstructionsSuccess = createAction(
  actionTypes.CREATE_OUTGOING_INSTRUCTIONS_SUCCEEDED
);
export const doCreateOutgoingInstructionsFailure = createAction(
  actionTypes.CREATE_OUTGOING_INSTRUCTIONS_FAILED
);

export const doApproveOutgoingPaymentInstruction = createAction(
  actionTypes.APPROVE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED
);
export const doApproveOutgoingPaymentInstructionSuccess = createAction(
  actionTypes.APPROVE_OUTGOING_PAYMENT_INSTRUCTION_SUCCEEDED
);
export const doApproveOutgoingPaymentInstructionFailure = createAction(
  actionTypes.APPROVE_OUTGOING_PAYMENT_INSTRUCTION_FAILED
);

export const doFinalizeOutgoingPaymentInstruction = createAction(
  actionTypes.FINALIZE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED
);
export const doFinalizeOutgoingPaymentInstructionSuccess = createAction(
  actionTypes.FINALIZE_OUTGOING_PAYMENT_INSTRUCTION_SUCCEEDED
);
export const doFinalizeOutgoingPaymentInstructionFailure = createAction(
  actionTypes.FINALIZE_OUTGOING_PAYMENT_INSTRUCTION_FAILED
);

export const doUpdateOutgoingPaymentInstruction = createAction(
  actionTypes.UPDATE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED
);
export const doUpdateOutgoingPaymentInstructionSuccess = createAction(
  actionTypes.UPDATE_OUTGOING_PAYMENT_INSTRUCTION_SUCCEEDED
);
export const doUpdateOutgoingPaymentInstructionFailure = createAction(
  actionTypes.UPDATE_OUTGOING_PAYMENT_INSTRUCTION_FAILED
);

export const doClientApproveOutgoingPaymentInstruction = createAction(
  actionTypes.CLIENT_APPROVE_OUTGOING_PAYMENT_INSTRUCTION_REQUESTED
);
export const doClientApproveOutgoingPaymentInstructionSuccess = createAction(
  actionTypes.CLIENT_APPROVE_OUTGOING_PAYMENT_INSTRUCTION_SUCCEEDED
);
export const doClientApproveOutgoingPaymentInstructionFailure = createAction(
  actionTypes.CLIENT_APPROVE_OUTGOING_PAYMENT_INSTRUCTION_FAILED
);

export const doFetchReconciledTransactions = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_RECONCILED_TRANSACTIONS_REQUESTED
);
export const doFetchReconciledTransactionsSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_RECONCILED_TRANSACTIONS_SUCCEEDED
);
export const doFetchReconciledTransactionsFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_RECONCILED_TRANSACTIONS_FAILED
);
