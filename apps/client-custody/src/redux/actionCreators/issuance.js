import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/issuance";

export const doFetchIssuances = createAction(actionTypes.ISSUANCES_FETCH_REQUESTED);
export const doFetchIssuancesSuccess = createAction(actionTypes.ISSUANCES_FETCH_SUCCEEDED);
export const doFetchIssuancesFailure = createAction(actionTypes.ISSUANCES_FETCH_FAILED);

export const doCreateIssuance = createAction(actionTypes.ISSUANCE_CREATE_REQUESTED);
export const doCreateIssuanceSuccess = createAction(actionTypes.ISSUANCE_CREATE_SUCCEEDED);
export const doCreateIssuanceFailure = createAction(actionTypes.ISSUANCE_CREATE_FAILED);

export const doFetchIssuanceOverview = createAction(actionTypes.ISSUANCE_OVERVIEW_FETCH_REQUESTED);
export const doFetchIssuanceOverviewSuccess = createAction(
  actionTypes.ISSUANCE_OVERVIEW_FETCH_SUCCEEDED
);
export const doFetchIssuanceOverviewFailure = createAction(
  actionTypes.ISSUANCE_OVERVIEW_FETCH_FAILED
);

export const doFetchIssuerClients = createAction(actionTypes.ISSUER_CLIENTS_FETCH_REQUESTED);
export const doFetchIssuerClientsSuccess = createAction(actionTypes.ISSUER_CLIENTS_FETCH_SUCCEEDED);
export const doFetchIssuerClientsFailure = createAction(actionTypes.ISSUER_CLIENTS_FETCH_FAILED);

export const doFetchCoArrangers = createAction(actionTypes.CO_ARRANGERS_FETCH_REQUESTED);
export const doFetchCoArrangersSuccess = createAction(actionTypes.CO_ARRANGERS_FETCH_SUCCEEDED);
export const doFetchCoArrangersFailure = createAction(actionTypes.CO_ARRANGERS_FETCH_FAILED);

export const doFetchFormOptions = createAction(actionTypes.FORM_OPTIONS_FETCH_REQUESTED);
export const doFetchFormOptionsSuccess = createAction(actionTypes.FORM_OPTIONS_FETCH_SUCCEEDED);
export const doFetchFormOptionsFailure = createAction(actionTypes.FORM_OPTIONS_FETCH_FAILED);

export const doFetchTermsheet = createAction(actionTypes.ISSUANCE_TERMSHEET_FETCH_REQUESTED);
export const doFetchTermsheetSuccess = createAction(actionTypes.ISSUANCE_TERMSHEET_FETCH_SUCCEEDED);
export const doFetchTermsheetFailure = createAction(actionTypes.ISSUANCE_TERMSHEET_FETCH_FAILED);

export const doSaveTermsheet = createAction(actionTypes.ISSUANCE_TERMSHEET_SAVE_REQUESTED);
export const doSaveTermsheetSuccess = createAction(actionTypes.ISSUANCE_TERMSHEET_SAVE_SUCCEEDED);
export const doSaveTermsheetFailure = createAction(actionTypes.ISSUANCE_TERMSHEET_SAVE_FAILED);

export const doPublishTermsheet = createAction(actionTypes.ISSUANCE_TERMSHEET_PUBLISH_REQUESTED);
export const doPublishTermsheetSuccess = createAction(
  actionTypes.ISSUANCE_TERMSHEET_PUBLISH_SUCCEEDED
);
export const doPublishTermsheetFailure = createAction(
  actionTypes.ISSUANCE_TERMSHEET_PUBLISH_FAILED
);

export const doReviewTermsheet = createAction(actionTypes.ISSUANCE_TERMSHEET_REVIEW_REQUESTED);
export const doReviewTermsheetSuccess = createAction(
  actionTypes.ISSUANCE_TERMSHEET_REVIEW_SUCCEEDED
);
export const doReviewTermsheetFailure = createAction(actionTypes.ISSUANCE_TERMSHEET_REVIEW__FAILED);

export const doUpdateSaveTermsheetState = createAction(actionTypes.UPDATE_SAVE_TERMSHEET_STATE);

export const doFinalizeTermsheet = createAction(actionTypes.ISSUANCE_TERMSHEET_FINALIZE_REQUESTED);
export const doFinalizeTermsheetSuccess = createAction(
  actionTypes.ISSUANCE_TERMSHEET_FINALIZE_SUCCEEDED
);
export const doFinalizeTermsheetFailure = createAction(
  actionTypes.ISSUANCE_TERMSHEET_FINALIZE_FAILED
);

export const doFetchFinalterms = createAction(actionTypes.ISSUANCE_TERMSHEET_FINAL_TERMS_REQUESTED);
export const doFetchFinaltermsSuccess = createAction(
  actionTypes.ISSUANCE_TERMSHEET_FINAL_TERMS_SUCCEEDED
);
export const doFetchFinaltermsFailure = createAction(
  actionTypes.ISSUANCE_TERMSHEET_FINAL_TERMS_FAILED
);

export const doApproveTermsheet = createAction(actionTypes.ISSUANCE_TERMSHEET_APPROVE_REQUESTED);
export const doApproveTermsheetSuccess = createAction(
  actionTypes.ISSUANCE_TERMSHEET_APPROVE_SUCCEEDED
);
export const doApproveTermsheetFailure = createAction(
  actionTypes.ISSUANCE_TERMSHEET_APPROVE_FAILED
);

export const doFetchInvestors = createAction(actionTypes.INVESTORS_FETCH_REQUESTED);
export const doFetchInvestorsSuccess = createAction(actionTypes.INVESTORS_FETCH_SUCCEEDED);
export const doFetchInvestorsFailure = createAction(actionTypes.INVESTORS_FETCH_FAILED);

export const doInviteInvestors = createAction(actionTypes.INVESTORS_INVITE_REQUESTED);
export const doInviteInvestorsSuccess = createAction(actionTypes.INVESTORS_INVITE_SUCCEEDED);
export const doInviteInvestorsFailure = createAction(actionTypes.INVESTORS_INVITE_FAILED);

export const doSendSubscription = createAction(actionTypes.SUBSCRIPTION_SEND_REQUESTED);
export const doSendSubscriptionSuccess = createAction(actionTypes.SUBSCRIPTION_SEND_SUCCEEDED);
export const doSendSubscriptionFailure = createAction(actionTypes.SUBSCRIPTION_SEND_FAILED);

export const doFetchSubscription = createAction(actionTypes.SUBSCRIPTION_FETCH_REQUESTED);
export const doFetchSubscriptionSuccess = createAction(actionTypes.SUBSCRIPTION_FETCH_SUCCEEDED);
export const doFetchSubscriptionFailure = createAction(actionTypes.SUBSCRIPTION_FETCH_FAILED);

export const doConfirmSubscription = createAction(actionTypes.SUBSCRIPTION_CONFIRM_REQUESTED);
export const doConfirmSubscriptionSuccess = createAction(
  actionTypes.SUBSCRIPTION_CONFIRM_SUCCEEDED
);
export const doConfirmSubscriptionFailure = createAction(actionTypes.SUBSCRIPTION_CONFIRM_FAILED);

export const doFinaliseSubscription = createAction(actionTypes.SUBSCRIPTION_FINALISE_REQUESTED);
export const doFinaliseSubscriptionSuccess = createAction(
  actionTypes.SUBSCRIPTION_FINALISE_SUCCEEDED
);
export const doFinaliseSubscriptionFailure = createAction(actionTypes.SUBSCRIPTION_FINALISE_FAILED);

export const doFetchServiceProviders = createAction(actionTypes.SERVICE_PROVIDER_FETCH_REQUESTED);
export const doFetchServiceProvidersSuccess = createAction(
  actionTypes.SERVICE_PROVIDER_FETCH_SUCCEEDED
);
export const doFetchServiceProvidersFailure = createAction(
  actionTypes.SERVICE_PROVIDER_FETCH_FAILED
);

export const doEngageServiceProvider = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGEMENT_REQUESTED
);
export const doEngageServiceProviderSuccess = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGEMENT_SUCCEEDED
);
export const doEngageServiceProviderFailure = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGEMENT_FAILED
);

export const doFetchEngagementRequests = createAction(
  actionTypes.ENGAGEMENT_REQUESTS_FETCH_REQUESTED
);
export const doFetchEngagementRequestsSuccess = createAction(
  actionTypes.ENGAGEMENT_REQUESTS_FETCH_SUCCEEDED
);
export const doFetchEngagementRequestsFailure = createAction(
  actionTypes.ENGAGEMENT_REQUESTS_FETCH_FAILED
);

export const doUploadEngagementLetter = createAction(
  actionTypes.ENGAGEMENT_LETTER_UPLOAD_REQUESTED
);
export const doUploadEngagementLetterSuccess = createAction(
  actionTypes.ENGAGEMENT_LETTER_UPLOAD_SUCCEEDED
);
export const doUploadEngagementLetterFailure = createAction(
  actionTypes.ENGAGEMENT_LETTER_UPLOAD_FAILED
);

export const doRequestSignature = createAction(actionTypes.ENGAGEMENT_LETTER_SIGNATURE_REQUESTED);
export const doRequestSignatureSuccess = createAction(
  actionTypes.ENGAGEMENT_LETTER_SIGNATURE_SUCCEEDED
);
export const doRequestSignatureFailure = createAction(actionTypes.SUBSCRIPTION_FINALISE_FAILED);

export const doFetchEngagementLetterUrl = createAction(
  actionTypes.ENGAGEMENT_LETTER_URL_FETCH_REQUESTED
);
export const doFetchEngagementLetterUrlSuccess = createAction(
  actionTypes.ENGAGEMENT_LETTER_URL_FETCH_SUCCEEDED
);
export const doFetchEngagementLetterUrlFailure = createAction(
  actionTypes.ENGAGEMENT_LETTER_URL_FETCH_FAILED
);

export const doFetchEngagementStatus = createAction(actionTypes.ENGAGEMENT_STATUS_FETCH_REQUESTED);
export const doFetchEngagementStatusSuccess = createAction(
  actionTypes.ENGAGEMENT_STATUS_FETCH_SUCCEEDED
);
export const doFetchEngagementStatusFailure = createAction(
  actionTypes.ENGAGEMENT_STATUS_FETCH_FAILED
);

export const doFetchEngagementObligorProposal = createAction(
  actionTypes.ENGAGEMENT_OBLIGOR_PROPOSAL_FETCH_REQUESTED
);
export const doFetchEngagementObligorProposalSuccess = createAction(
  actionTypes.ENGAGEMENT_OBLIGOR_PROPOSAL_FETCH_SUCCEEDED
);
export const doFetchEngagementObligorProposalFailure = createAction(
  actionTypes.ENGAGEMENT_OBLIGOR_PROPOSAL_FETCH_FAILED
);

export const doSubmitBypassSignedEngagement = createAction(
  actionTypes.SUBMIT_BYPASS_SIGNED_ENGAGEMENT_REQUESTED
);
export const doSubmitBypassSignedEngagementSuccess = createAction(
  actionTypes.SUBMIT_BYPASS_SIGNED_ENGAGEMENT_SUCCEEDED
);
export const doSubmitBypassSignedEngagementFailure = createAction(
  actionTypes.SUBMIT_BYPASS_SIGNED_ENGAGEMENT_FAILED
);

export const doSigningPreAction = createAction(actionTypes.SIGNING_PREACTION_REQUESTED);
export const doSigningPreActionSuccess = createAction(actionTypes.SIGNING_PREACTION_SUCCEEDED);
export const doSigningPreActionFailure = createAction(actionTypes.SIGNING_PREACTION_FAILED);

export const doSigningFetchPreAction = createAction(actionTypes.SIGNING_FETCH_PREACTION_REQUESTED);
export const doSigningFetchPreActionSuccess = createAction(
  actionTypes.SIGNING_FETCH_PREACTION_SUCCEEDED
);
export const doSigningFetchPreActionFailure = createAction(
  actionTypes.SIGNING_FETCH_PREACTION_FAILED
);

export const doSigningFetchCompleteAgenda = createAction(
  actionTypes.SIGNING_COMPLETE_AGENDA_REQUESTED
);
export const doSigningFetchCompleteAgendaSuccess = createAction(
  actionTypes.SIGNING_COMPLETE_AGENDA_SUCCEEDED
);
export const doSigningFetchCompleteAgendaFailure = createAction(
  actionTypes.SIGNING_COMPLETE_AGENDA_FAILED
);

export const doSigningReviewDocs = createAction(actionTypes.SIGNING_REVIEW_DOCS_REQUESTED);
export const doSigningReviewDocsSuccess = createAction(actionTypes.SIGNING_REVIEW_DOCS_SUCCEEDED);
export const doSigningReviewDocsFailure = createAction(actionTypes.SIGNING_REVIEW_DOCS_FAILED);

export const doUploadExecDocs = createAction(actionTypes.UPLOAD_EXEC_DOC_REQUESTED);
export const doUploadExecDocsSuccess = createAction(actionTypes.UPLOAD_EXEC_DOC_SUCCEEDED);
export const doUploadExecDocsFailure = createAction(actionTypes.UPLOAD_EXEC_DOC_FAILED);

export const doUploadReviewDocs = createAction(actionTypes.UPLOAD_REVIEW_DOC_REQUESTED);
export const doUploadReviewDocsSuccess = createAction(actionTypes.UPLOAD_REVIEW_DOC_SUCCEEDED);
export const doUploadReviewDocsFailure = createAction(actionTypes.UPLOAD_REVIEW_DOC_FAILED);

export const doFetchDocusignLink = createAction(actionTypes.DOCUSIGN_LINK_REQUESTED);
export const doFetchDocusignLinkSuccess = createAction(actionTypes.DOCUSIGN_LINK_SUCCEEDED);
export const doFetchDocusignLinkFailure = createAction(actionTypes.DOCUSIGN_LINK_FAILED);

export const doFetchAuthlessDocusignLink = createAction(
  actionTypes.AUTHLESS_DOCUSIGN_LINK_REQUESTED
);
export const doFetchAuthlessDocusignLinkSuccess = createAction(
  actionTypes.AUTHLESS_DOCUSIGN_LINK_SUCCEEDED
);
export const doFetchAuthlessDocusignLinkFailure = createAction(
  actionTypes.AUTHLESS_DOCUSIGN_LINK_FAILED
);

export const doFetchReviewDocusignLink = createAction(actionTypes.REVIEW_DOCUSIGN_LINK_REQUESTED);
export const doFetchReviewDocusignLinkSuccess = createAction(
  actionTypes.REVIEW_DOCUSIGN_LINK_SUCCEEDED
);
export const doFetchReviewDocusignLinkFailure = createAction(
  actionTypes.REVIEW_DOCUSIGN_LINK_FAILED
);

export const doCompleteDocument = createAction(actionTypes.COMPLETE_DOCUMENT_REQUESTED);
export const doCompleteDocumentSuccess = createAction(actionTypes.COMPLETE_DOCUMENT_SUCCEEDED);
export const doCompleteDocumentFailure = createAction(actionTypes.COMPLETE_DOCUMENT_FAILED);

export const doSigningFetchAgenda = createAction(actionTypes.SIGNING_AGENDA_REQUESTED);
export const doSigningFetchAgendaSuccess = createAction(actionTypes.SIGNING_AGENDA_SUCCEEDED);
export const doSigningFetchAgendaFailure = createAction(actionTypes.SIGNING_AGENDA_FAILED);
export const doFetchSigningPostAction = createAction(
  actionTypes.SIGNING_POSTACTION_FETCH_REQUESTED
);
export const doFetchSigningPostActionSuccess = createAction(
  actionTypes.SIGNING_POSTACTION_FETCH_SUCCEEDED
);
export const doFetchSigningPostActionFailure = createAction(
  actionTypes.SIGNING_POSTACTION_FETCH_FAILED
);

export const doUpdateSigningPostAction = createAction(
  actionTypes.SIGNING_POSTACTION_UPDATE_REQUESTED
);
export const doUpdateSigningPostActionSuccess = createAction(
  actionTypes.SIGNING_POSTACTION_UPDATE_SUCCEEDED
);
export const doUpdateSigningPostActionFailure = createAction(
  actionTypes.SIGNING_POSTACTION_UPDATE_FAILED
);

export const doFetchClosingData = createAction(actionTypes.CLOSING_DATA_REQUESTED);
export const doFetchClosingDataSuccess = createAction(actionTypes.CLOSING_DATA_SUCCEEDED);
export const doFetchClosingDataFailure = createAction(actionTypes.CLOSING_DATA_FAILED);

export const doRequestClosing = createAction(actionTypes.CLOSING_REQUEST_REQUESTED);
export const doRequestClosingSuccess = createAction(actionTypes.CLOSING_REQUEST_SUCCEEDED);
export const doRequestClosingFailure = createAction(actionTypes.CLOSING_REQUEST_FAILED);

export const doConfirmClosing = createAction(actionTypes.CLOSING_CONFIRMATION_REQUESTED);
export const doConfirmClosingSuccess = createAction(actionTypes.CLOSING_CONFIRMATION_SUCCEEDED);
export const doConfirmClosingFailure = createAction(actionTypes.CLOSING_CONFIRMATION_FAILED);

export const doInitializeClosing = createAction(actionTypes.CLOSING_INITIALIZATION_REQUESTED);
export const doInitializeClosingSuccess = createAction(
  actionTypes.CLOSING_INITIALIZATION_SUCCEEDED
);
export const doInitializeClosingFailure = createAction(actionTypes.CLOSING_INITIALIZATION_FAILED);

export const doCompleteClosing = createAction(actionTypes.CLOSING_COMPLETE_REQUESTED);
export const doCompleteClosingSuccess = createAction(actionTypes.CLOSING_COMPLETE_SUCCEEDED);
export const doCompleteClosingFailure = createAction(actionTypes.CLOSING_COMPLETE_FAILED);

export const doSendExecDocs = createAction(actionTypes.SEND_EXEC_DOC_REQUESTED);
export const doSendExecDocsSuccess = createAction(actionTypes.SEND_EXEC_DOC_SUCCEEDED);
export const doSendExecDocsFailure = createAction(actionTypes.SEND_EXEC_DOC_FAILED);

export const doSendReviewDocs = createAction(actionTypes.SEND_REVIEW_DOC_REQUESTED);
export const doSendReviewDocsSuccess = createAction(actionTypes.SEND_REVIEW_DOC_SUCCEEDED);
export const doSendReviewDocsFailure = createAction(actionTypes.SEND_REVIEW_DOC_FAILED);

export const doFetchAdmissionTermsheetData = createAction(
  actionTypes.ADMISSION_TERMSHEET_DATA_REQUESTED
);
export const doFetchAdmissionTermsheetDataSuccess = createAction(
  actionTypes.ADMISSION_TERMSHEET_DATA_SUCCEEDED
);
export const doFetchAdmissionTermsheetDataFailure = createAction(
  actionTypes.ADMISSION_TERMSHEET_DATA_FAILED
);

export const doFetchAdmissionTerms = createAction(actionTypes.ADMISSION_TERMS_REQUESTED);
export const doFetchAdmissionTermsSuccess = createAction(actionTypes.ADMISSION_TERMS_SUCCEEDED);
export const doFetchAdmissionTermsFailure = createAction(actionTypes.ADMISSION_TERMS_FAILED);

export const doSetAdmissionTermsObjectURL = createAction(
  actionTypes.ADMISSION_SET_TERMS_OBJECT_URL
);
export const doClearAdmissionTermsObjectURL = createAction(
  actionTypes.ADMISSION_CLEAR_TERMS_OBJECT_URL
);

export const doSubmitAdmissionTerms = createAction(actionTypes.SUBMIT_ADMISSION_TERMS_REQUESTED);
export const doSubmitAdmissionTermsSuccess = createAction(
  actionTypes.SUBMIT_ADMISSION_TERMS_SUCCEEDED
);
export const doSubmitAdmissionTermsFailure = createAction(
  actionTypes.SUBMIT_ADMISSION_TERMS_FAILED
);

export const doFetchAdmissionStatus = createAction(actionTypes.FETCH_ADMISSION_STATUS_REQUESTED);
export const doFetchAdmissionStatusSuccess = createAction(
  actionTypes.FETCH_ADMISSION_STATUS_SUCCEEDED
);
export const doFetchAdmissionStatusFailure = createAction(
  actionTypes.FETCH_ADMISSION_STATUS_FAILED
);

export const doFetchIssuers = createAction(actionTypes.ISSUERS_FETCH_REQUESTED);
export const doFetchIssuersSuccess = createAction(actionTypes.ISSUERS_FETCH_SUCCEEDED);
export const doFetchIssuersFailure = createAction(actionTypes.ISSUERS_FETCH_FAILED);

export const doFetchCMADocs = createAction(actionTypes.FETCH_CMA_DOCS_REQUESTED);
export const doFetchCMADocsSuccess = createAction(actionTypes.FETCH_CMA_DOCS_SUCCEEDED);
export const doFetchCMADocsFailure = createAction(actionTypes.FETCH_CMA_DOCS_FAILED);

export const doFetchCMAIssuanceApprovalStatus = createAction(
  actionTypes.FETCH_CMA_ISSUANCE_APPROVAL_STATUS_REQUESTED
);
export const doFetchCMAIssuanceApprovalStatusSuccess = createAction(
  actionTypes.FETCH_CMA_ISSUANCE_APPROVAL_STATUS_SUCCEEDED
);
export const doFetchCMAIssuanceApprovalStatusFailure = createAction(
  actionTypes.FETCH_CMA_ISSUANCE_APPROVAL_STATUS_FAILED
);

export const doFetchCMASPEIncorporationApprovalStatus = createAction(
  actionTypes.FETCH_CMA_SPE_INCORPORATION_APPROVAL_STATUS_REQUESTED
);
export const doFetchCMASPEIncorporationApprovalStatusSuccess = createAction(
  actionTypes.FETCH_CMA_SPE_INCORPORATION_APPROVAL_STATUS_SUCCEEDED
);
export const doFetchCMASPEIncorporationApprovalStatusFailure = createAction(
  actionTypes.FETCH_CMA_SPE_INCORPORATION_APPROVAL_STATUS_FAILED
);

export const doConfirmCMAIssuanceApprovalStatus = createAction(
  actionTypes.CONFIRM_CMA_ISSUANCE_APPROVAL_STATUS_REQUESTED
);
export const doConfirmCMAIssuanceApprovalStatusSuccess = createAction(
  actionTypes.CONFIRM_CMA_ISSUANCE_APPROVAL_STATUS_SUCCEEDED
);
export const doConfirmCMAIssuanceApprovalStatusFailure = createAction(
  actionTypes.CONFIRM_CMA_ISSUANCE_APPROVAL_STATUS_FAILED
);

export const doConfirmCMASPEIncorporationApprovalStatus = createAction(
  actionTypes.CONFIRM_CMA_SPE_INCORPORATION_APPROVAL_STATUS_REQUESTED
);
export const doConfirmCMASPEIncorporationApprovalStatusSuccess = createAction(
  actionTypes.CONFIRM_CMA_SPE_INCORPORATION_APPROVAL_STATUS_SUCCEEDED
);
export const doConfirmCMASPEIncorporationApprovalStatusFailure = createAction(
  actionTypes.CONFIRM_CMA_SPE_INCORPORATION_APPROVAL_STATUS_FAILED
);

export const doUploadCMARelatedDoc = createAction(actionTypes.UPLOAD_CMA_RELATED_DOC_REQUESTED);
export const doUploadCMARelatedDocSuccess = createAction(
  actionTypes.UPLOAD_CMA_RELATED_DOC_SUCCEEDED
);
export const doUploadCMARelatedDocFailure = createAction(actionTypes.UPLOAD_CMA_RELATED_DOC_FAILED);

export const doFetchAllIssuances = createAction(actionTypes.ISSUANCES_FETCH_ALL_REQUESTED);
export const doFetchAllIssuancesSuccess = createAction(actionTypes.ISSUANCES_FETCH_ALL_SUCCEEDED);
export const doFetchAllIssuancesFailure = createAction(actionTypes.ISSUANCES_FETCH_ALL_FAILED);

export const doResetCMADocumentURLsState = createAction(actionTypes.RESET_CMA_DOCUMENT_URLS_STATE);

export const doFetchIssuancesByStatus = createAction(
  actionTypes.ISSUANCES_FETCH_BY_STATUS_REQUESTED
);
export const doFetchIssuancesByStatusSuccess = createAction(
  actionTypes.ISSUANCES_FETCH_BY_STATUS_SUCCEEDED
);
export const doFetchIssuancesByStatusFailure = createAction(
  actionTypes.ISSUANCES_FETCH_BY_STATUS_FAILED
);

export const doAddCoArranger = createAction(actionTypes.ADD_CO_ARRANGER_REQUESTED);
export const doAddCoArrangerSuccess = createAction(actionTypes.ADD_CO_ARRANGER_SUCCEEDED);
export const doAddCoArrangerFailure = createAction(actionTypes.ADD_CO_ARRANGER_FAILED);

export const doResetIssuanceTermsheet = createAction(
  actionTypes.ISSUANCE_TERMSHEET_RESET_REQUESTED
);
