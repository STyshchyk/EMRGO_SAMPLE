import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/kyc";

export const doSendEOIKit = createAction(actionTypes.KYC_EOI_SEND_KIT_REQUESTED);
export const doSendEOIKitSuccess = createAction(actionTypes.KYC_EOI_SEND_KIT_SUCCEEDED);
export const doSendEOIKitFailure = createAction(actionTypes.KYC_EOI_SEND_KIT_FAILED);

export const doFetchKYCData = createAction(actionTypes.ENTITY_KYC_FETCH_REQUESTED);
export const doFetchKYCDataSuccess = createAction(actionTypes.ENTITY_KYC_FETCH_SUCCEEDED);
export const doFetchKYCDataFailure = createAction(actionTypes.ENTITY_KYC_FETCH_FAILED);

export const doPostKYCData = createAction(actionTypes.ENTITY_KYC_POST_REQUESTED);
export const doPostKYCDataSuccess = createAction(actionTypes.ENTITY_KYC_POST_SUCCEEDED);
export const doPostKYCDataFailure = createAction(actionTypes.ENTITY_KYC_POST_FAILED);

export const doApproveKYC = createAction(actionTypes.KYC_APPROVAL_REQUESTED);
export const doApproveKYCSuccess = createAction(actionTypes.KYC_APPROVAL_SUCCEEDED);
export const doApproveKYCFailure = createAction(actionTypes.KYC_APPROVAL_FAILED);

export const doUploadKycFile = createAction(actionTypes.KYC_FILE_UPLOAD_REQUESTED);
export const doUploadKycFileSuccess = createAction(actionTypes.KYC_FILE_UPLOAD_SUCCEEDED);
export const doUploadKycFileFailure = createAction(actionTypes.KYC_FILE_UPLOAD_FAILED);

export const doFetchClientClassificationDropdowns = createAction(actionTypes.FETCH_CC_DROPDOWNS);
export const doFetchClientClassificationDropdownsSuccess = createAction(
  actionTypes.FETCH_CC_DROPDOWNS_SUCCEEDED
);
export const doFetchClientClassificationDropdownsFailure = createAction(
  actionTypes.FETCH_CC_DROPDOWNS_FAILED
);

export const doPostKYCClassificationData = createAction(actionTypes.KYC_CC_DATA_POST_REQUESTED);
export const doPostKYCClassificationDataSuccess = createAction(
  actionTypes.KYC_CC_DATA_POST_SUCCEEDED
);
export const doPostKYCClassificationDataFailure = createAction(actionTypes.KYC_CC_DATA_POST_FAILED);

export const doPostKYCRequirementsData = createAction(actionTypes.KYC_REQ_DATA_POST_REQUESTED);
export const doPostKYCRequirementsDataSuccess = createAction(
  actionTypes.KYC_REQ_DATA_POST_SUCCEEDED
);
export const doPostKYCRequirementsDataFailure = createAction(actionTypes.KYC_REQ_DATA_POST_FAILED);

export const doPostKYCSanctionsData = createAction(actionTypes.KYC_SANCTIONS_DATA_POST_REQUESTED);
export const doPostKYCSanctionsDataSuccess = createAction(
  actionTypes.KYC_SANCTIONS_DATA_POST_SUCCEEDED
);
export const doPostKYCSanctionsDataFailure = createAction(
  actionTypes.KYC_SANCTIONS_DATA_POST_FAILED
);

export const doSubmitKYC = createAction(actionTypes.KYC_SUBMISSION_REQUESTED);
export const doSubmitKYCSuccess = createAction(actionTypes.KYC_SUBMISSION_SUCCEEDED);
export const doSubmitKYCFailure = createAction(actionTypes.KYC_SUBMISSION_FAILED);

export const doRejectKYC = createAction(actionTypes.KYC_REJECTION_REQUESTED);
export const doRejectKYCSuccess = createAction(actionTypes.KYC_REJECTION_SUCCEEDED);
export const doRejectKYCFailure = createAction(actionTypes.KYC_REJECTION_FAILED);

export const doFetchDropdowns = createAction(actionTypes.FETCH_DROPDOWNS);
export const doFetchDropdownsSuccess = createAction(actionTypes.FETCH_DROPDOWNS_SUCCEEDED);
export const doFetchDropdownsFailure = createAction(actionTypes.FETCH_DROPDOWNS_FAILED);

export const doResetUploadedKYCFileState = createAction(actionTypes.RESET_UPLOADED_KYC_FILES_STATE);

export const doFetchPaymentAccounts = createAction(actionTypes.PAYMENT_ACCOUNTS_FETCH_REQUESTED);
export const doFetchPaymentAccountsSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_SUCCEEDED
);
export const doFetchPaymentAccountsFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_FAILED
);

export const doFetchPaymentAccountsByEntityID = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_BY_ENTITY_ID_REQUESTED
);
export const doFetchPaymentAccountsByEntityIDSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_BY_ENTITY_ID_SUCCEEDED
);
export const doFetchPaymentAccountsByEntityIDFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_BY_ENTITY_ID_FAILED
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

export const doAddPaymentAccount = createAction(actionTypes.PAYMENT_ACCOUNTS_ADD_REQUESTED);
export const doAddPaymentAccountSuccess = createAction(actionTypes.PAYMENT_ACCOUNTS_ADD_SUCCEEDED);
export const doAddPaymentAccountFailure = createAction(actionTypes.PAYMENT_ACCOUNTS_ADD_FAILED);

export const doDeletePaymentAccount = createAction(actionTypes.PAYMENT_ACCOUNTS_DELETE_REQUESTED);
export const doDeletePaymentAccountSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_DELETE_SUCCEEDED
);
export const doDeletePaymentAccountFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_DELETE_FAILED
);

export const doEditPaymentAccount = createAction(actionTypes.PAYMENT_ACCOUNTS_EDIT_REQUESTED);
export const doEditPaymentAccountSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_EDIT_SUCCEEDED
);
export const doEditPaymentAccountFailure = createAction(actionTypes.PAYMENT_ACCOUNTS_EDIT_FAILED);

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

export const doFetchUploadedSupportingDocumentFile = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_REQUESTED
);
export const doFetchUploadedSupportingDocumentFileSuccess = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_SUCCEEDED
);
export const doFetchUploadedSupportingDocumentFileFailure = createAction(
  actionTypes.PAYMENT_ACCOUNTS_FETCH_UPLOADED_SUPPORTING_DOCUMENT_FILE_FAILED
);

export const doFetchElmUser = createAction(actionTypes.ELM_USER_FETCH_REQUESTED);
export const doFetchElmUserSuccess = createAction(actionTypes.ELM_USER_FETCH_SUCCEEDED);
export const doFetchElmUserFailure = createAction(actionTypes.ELM_USER_FETCH_FAILED);
