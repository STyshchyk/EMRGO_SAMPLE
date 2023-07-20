import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/issuance";

const defaultState = {
  admissionTermsObjectURL: undefined,
  agenda: null,
  allIssuances: null,
  areEngagementDocumentsUploading: {},
  capitalMarketAuthorityData: {
    capitalMarketAuthorityIssuanceApprovalStatus: false,
    capitalMarketAuthoritySPEIncorporationApprovalStatus: false,
  },
  capitalMarketAuthorityDocumentURLs: null,
  closingData: null,
  docusignURL: "",
  dropdowns: {},
  engagementObligorProposalSignedDocURL: undefined,
  errorMessage: null,
  hasSavedTermsheet: false,
  isCompletingDocs: false,
  isConfirmingSubscriptions: false,
  isDocusignLoading: false,
  isFetching: false,
  isFetchingAdmissionTerms: false,
  isFetchingAdmissionTermsheetData: false,
  isFetchingClosingData: false,
  isFetchingDropdowns: false,
  isFetchingEnagementRequests: false,
  isFetchingEngagementObligorProposalSignedDocURL: false,
  isFetchingFinalterms: false,
  isFetchingIssuanceOverview: false,
  isFetchingIssuances: false,
  isFetchingReviewDocs: false,
  isFetchingSigningAgenda: false,
  isFetchingSubscriptions: false,
  isFinalisingSubscriptions: false,
  isRequesting: false,
  isSendingSigningPreActions: false,
  isSendingSubscriptions: false,
  isSendingTermsheetForReview: false,
  issuances: null,
  isSubmitting: false,
  isSubmittingTermSheet: false,
  issuers: [],
  isUpdatingClosing: false,
  isUploadingExecDocument: false,
  isUploadingReviewDocument: false,
  message: null,
  review: null,
  signingPreActionData: null,
  termsheet: {},
  isSubmittingBypassSignedEngagement: false,
  hasSubmittedBypassSignedEnagagement: false,
  hasEngagementLetterUploaded: false,
};

const issuanceReducers = handleActions(
  {
    [actionCreators.doFetchIssuances]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingIssuances = true;
    }),
    [actionCreators.doFetchIssuancesSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { issuances },
          },
        }
      ) => {
        draft.issuances = issuances;
        draft.isFetchingIssuances = false;
      }
    ),
    [actionCreators.doFetchIssuancesFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingIssuances = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doCreateIssuance]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doCreateIssuanceSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doCreateIssuanceFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSubmitting = false;
    }),
    [actionCreators.doFetchIssuanceOverview]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingIssuanceOverview = true;
    }),
    [actionCreators.doFetchIssuanceOverviewSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { sukukOverview },
          },
        }
      ) => {
        draft.issuanceOverview = sukukOverview;
        draft.isFetchingIssuanceOverview = false;
      }
    ),
    [actionCreators.doFetchIssuanceOverviewFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingIssuanceOverview = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchIssuerClients]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingIssuerClients = true;
    }),
    [actionCreators.doFetchIssuerClientsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { clients },
          },
        }
      ) => {
        draft.issuerClients = clients;
        draft.isFetchingIssuerClients = false;
      }
    ),
    [actionCreators.doFetchIssuerClientsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingIssuerClients = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchCoArrangers]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingCoArrangers = true;
    }),
    [actionCreators.doFetchCoArrangersSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { coArrangers },
          },
        }
      ) => {
        draft.coArrangers = coArrangers;
        draft.isFetchingCoArrangers = false;
      }
    ),
    [actionCreators.doFetchCoArrangersFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingCoArrangers = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchFormOptions]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingDropdowns = true;
    }),
    [actionCreators.doFetchFormOptionsSuccess]: produce((draft, { payload: { data } }) => {
      draft.dropdowns = { ...draft.dropdowns, ...data };
      draft.isFetchingDropdowns = false;
    }),
    [actionCreators.doFetchFormOptionsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingDropdowns = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchTermsheet]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingTermsheet = true;
      draft.termsheet = null;
    }),
    [actionCreators.doFetchTermsheetSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { sukuk },
          },
        }
      ) => {
        draft.termsheet = sukuk;
        draft.isFetchingTermsheet = false;
      }
    ),
    [actionCreators.doFetchTermsheetFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingTermsheet = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchFinalterms]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingFinalterms = true;
      draft.finalterms = null;
    }),
    [actionCreators.doFetchFinaltermsSuccess]: produce((draft, { payload: { data } }) => {
      draft.finalterms = data;
      draft.isFetchingFinalterms = false;
    }),
    [actionCreators.doFetchFinaltermsFailure]: produce((draft, { payload }) => {
      draft.isFetchingFinalterms = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doSaveTermsheet]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmittingTermSheet = true;
    }),
    [actionCreators.doSaveTermsheetSuccess]: produce((draft) => {
      draft.isSubmittingTermSheet = false;
    }),
    [actionCreators.doSaveTermsheetFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSubmittingTermSheet = false;
    }),
    [actionCreators.doUpdateSaveTermsheetState]: produce((draft, { payload }) => {
      draft.hasSavedTermsheet = payload;
    }),
    [actionCreators.doPublishTermsheet]: produce((draft) => {
      draft.errorMessage = null;
      draft.isPublishingTermSheet = true;
    }),
    [actionCreators.doPublishTermsheetSuccess]: produce((draft) => {
      draft.isPublishingTermSheet = false;
    }),
    [actionCreators.doPublishTermsheetFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isPublishingTermSheet = false;
    }),
    [actionCreators.doReviewTermsheet]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSendingTermsheetForReview = true;
    }),
    [actionCreators.doReviewTermsheetSuccess]: produce((draft) => {
      draft.isSendingTermsheetForReview = false;
    }),
    [actionCreators.doReviewTermsheetFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSendingTermsheetForReview = false;
    }),
    [actionCreators.doFinalizeTermsheet]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doFinalizeTermsheetSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doFinalizeTermsheetFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSubmitting = false;
    }),
    [actionCreators.doApproveTermsheet]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doApproveTermsheetSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doApproveTermsheetFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isRequesting = false;
    }),
    [actionCreators.doFetchInvestors]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingInvestors = true;
    }),
    [actionCreators.doFetchInvestorsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { investors },
          },
        }
      ) => {
        draft.investors = investors;
        draft.isFetchingInvestors = false;
      }
    ),
    [actionCreators.doFetchInvestorsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingInvestors = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doInviteInvestors]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doInviteInvestorsSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doInviteInvestorsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSubmitting = false;
    }),
    [actionCreators.doSendSubscription]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSendingSubscriptions = true;
    }),
    [actionCreators.doSendSubscriptionSuccess]: produce((draft) => {
      draft.isSendingSubscriptions = false;
    }),
    [actionCreators.doSendSubscriptionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSendingSubscriptions = false;
    }),
    [actionCreators.doFetchSubscription]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingSubscriptions = true;
    }),
    [actionCreators.doFetchSubscriptionSuccess]: produce((draft, { payload: { data } }) => {
      draft.subscriptionData = data;
      draft.isFetchingSubscriptions = false;
    }),
    [actionCreators.doFetchSubscriptionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingSubscriptions = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doConfirmSubscription]: produce((draft) => {
      draft.errorMessage = null;
      draft.isConfirmingSubscriptions = true;
    }),
    [actionCreators.doConfirmSubscriptionSuccess]: produce((draft) => {
      draft.isConfirmingSubscriptions = false;
    }),
    [actionCreators.doConfirmSubscriptionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isConfirmingSubscriptions = false;
    }),
    [actionCreators.doFinaliseSubscription]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFinalisingSubscriptions = true;
    }),
    [actionCreators.doFinaliseSubscriptionSuccess]: produce((draft) => {
      draft.isFinalisingSubscriptions = false;
    }),
    [actionCreators.doFinaliseSubscriptionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFinalisingSubscriptions = false;
    }),
    [actionCreators.doFetchServiceProviders]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingServiceProviders = true;
    }),
    [actionCreators.doFetchServiceProvidersSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { providers },
          },
        }
      ) => {
        draft.serviceProviders = providers;
        draft.isFetchingServiceProviders = false;
      }
    ),
    [actionCreators.doFetchServiceProvidersFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingServiceProviders = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doEngageServiceProvider]: produce((draft) => {
      draft.errorMessage = null;
    }),
    [actionCreators.doEngageServiceProviderSuccess]: produce((draft, { payload }) => {
      draft.message = payload;
    }),
    [actionCreators.doEngageServiceProviderFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchEngagementRequests]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingEnagementRequests = true;
    }),
    [actionCreators.doFetchEngagementRequestsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { engagements },
          },
        }
      ) => {
        const documentsUploading = {};
        engagements.map((document) => {
          documentsUploading[document.id] = false;
          return false;
        });
        draft.areEngagementDocumentsUploading = documentsUploading;
        draft.engagementRequests = engagements;
        draft.isFetchingEnagementRequests = false;
        draft.hasSubmittedBypassSignedEnagagement = false;
      }
    ),
    [actionCreators.doFetchEngagementRequestsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingEnagementRequests = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doUploadEngagementLetter]: produce((draft, { payload }) => {
      draft.areEngagementDocumentsUploading[payload.engagementId] = true;
    }),
    [actionCreators.doUploadEngagementLetterSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.areEngagementDocumentsUploading[data.id] = false;
        draft.hasEngagementLetterUploaded = true;
      }
    ),
    [actionCreators.doUploadEngagementLetterFailure]: produce((draft, { payload }) => {
      draft.errorMessage = payload.errorMessage;
      draft.areEngagementDocumentsUploading[payload.payload.engagementId] = false;
    }),

    [actionCreators.doFetchEngagementLetterUrl]: produce((draft) => {
      draft.errorMessage = null;
      draft.letterUrl = null;
      draft.isFetchingLetterUrl = true;
    }),
    [actionCreators.doFetchEngagementLetterUrlSuccess]: produce((draft, { payload: { data } }) => {
      draft.letterUrl = data;
      draft.isFetchingLetterUrl = false;
    }),
    [actionCreators.doFetchEngagementLetterUrlFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.letterUrl = null;
      draft.isFetchingLetterUrl = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doSigningFetchPreAction]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSendingSigningPreActions = true;
    }),
    [actionCreators.doSigningFetchPreActionSuccess]: produce((draft, { payload }) => {
      draft.signingPreActionData = payload.data;
      draft.isSendingSigningPreActions = false;
    }),
    [actionCreators.doSigningFetchPreActionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSendingSigningPreActions = false;
    }),
    [actionCreators.doSigningPreAction]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSendingSigningPreActions = true;
    }),
    [actionCreators.doSigningPreActionSuccess]: produce((draft, { payload }) => {
      draft.signingPreActionData = payload.data;
      draft.isSendingSigningPreActions = false;
    }),
    [actionCreators.doSigningPreActionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSendingSigningPreActions = false;
    }),
    [actionCreators.doSigningFetchCompleteAgenda]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingSigningAgenda = true;
    }),
    [actionCreators.doSigningFetchCompleteAgendaSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.agenda = data;
        draft.isFetchingSigningAgenda = false;
      }
    ),
    [actionCreators.doSigningFetchCompleteAgendaFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingSigningAgenda = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doSigningReviewDocs]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingReviewDocs = true;
    }),
    [actionCreators.doSigningReviewDocsSuccess]: produce((draft, { payload }) => {
      draft.review = payload.data;
      draft.isFetchingReviewDocs = false;
    }),
    [actionCreators.doSigningReviewDocsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingReviewDocs = false;
    }),

    [actionCreators.doUploadExecDocs]: produce((draft) => {
      draft.errorMessage = null;
      draft.isUploadingExecDocument = true;
    }),
    [actionCreators.doUploadExecDocsSuccess]: produce((draft, { payload }) => {
      const index = draft.agenda.agenda.findIndex(
        (el) => el.documentName === payload.data.documentName
      );
      draft.agenda.agenda[index].id = payload.data.documentRow.id;
      draft.agenda.agenda[index].isCompleted = payload.data.documentRow.isCompleted;
      draft.agenda.agenda[index].fileId = payload.data.documentRow.fileId;
      draft.isUploadingExecDocument = false;
    }),
    [actionCreators.doUploadExecDocsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isUploadingExecDocument = false;
    }),

    [actionCreators.doUploadReviewDocs]: produce((draft) => {
      draft.errorMessage = null;
      draft.isUploadingReviewDocument = true;
    }),
    [actionCreators.doUploadReviewDocsSuccess]: produce((draft, { payload }) => {
      draft.signingPreActionData = payload.data;
      draft.isUploadingReviewDocument = false;
    }),
    [actionCreators.doUploadReviewDocsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isUploadingReviewDocument = false;
    }),

    [actionCreators.doFetchDocusignLink]: produce((draft) => {
      draft.isDocusignLoading = true;
    }),
    [actionCreators.doFetchDocusignLinkSuccess]: produce((draft, { payload: { data } }) => {
      draft.docusignURL = data.url;
      draft.isDocusignLoading = false;
    }),
    [actionCreators.doFetchDocusignLinkFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isDocusignLoading = false;
    }),

    [actionCreators.doFetchAuthlessDocusignLink]: produce((draft) => {
      draft.isDocusignLoading = true;
    }),
    [actionCreators.doFetchAuthlessDocusignLinkSuccess]: produce((draft, { payload: { data } }) => {
      draft.docusignURL = data.url;
      draft.isDocusignLoading = false;
    }),
    [actionCreators.doFetchAuthlessDocusignLinkFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isDocusignLoading = false;
    }),

    [actionCreators.doFetchReviewDocusignLink]: produce((draft) => {
      draft.isDocusignLoading = true;
    }),
    [actionCreators.doFetchReviewDocusignLinkSuccess]: produce((draft, { payload: { data } }) => {
      draft.docusignURL = data.link;
      draft.isDocusignLoading = false;
    }),
    [actionCreators.doFetchReviewDocusignLinkFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isDocusignLoading = false;
    }),

    [actionCreators.doCompleteDocument]: produce((draft) => {
      draft.errorMessage = null;
      draft.isCompletingDocs = true;
    }),
    [actionCreators.doCompleteDocumentSuccess]: produce((draft, { payload }) => {
      draft.signingPreActionData = payload.data;
      draft.isCompletingDocs = false;
    }),
    [actionCreators.doCompleteDocumentFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isCompletingDocs = false;
    }),
    [actionCreators.doSigningFetchAgenda]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingSigningAgenda = true;
    }),
    [actionCreators.doSigningFetchAgendaSuccess]: produce((draft, { payload: { data } }) => {
      draft.agenda = data;
      draft.isFetchingSigningAgenda = false;
    }),
    [actionCreators.doSigningFetchAgendaFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingSigningAgenda = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchSigningPostAction]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingPostSigning = true;
    }),
    [actionCreators.doFetchSigningPostActionSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { actions },
          },
        }
      ) => {
        draft.postSigningActions = actions;
        draft.isFetchingPostSigning = false;
      }
    ),
    [actionCreators.doFetchSigningPostActionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingPostSigning = false;
    }),
    [actionCreators.doUpdateSigningPostAction]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSendingSigningPostActions = true;
    }),
    [actionCreators.doUpdateSigningPostActionSuccess]: produce((draft, { payload }) => {
      draft.signingPostActionData = payload.data;
      draft.isSendingSigningPostActions = false;
    }),
    [actionCreators.doUpdateSigningPostActionFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSendingSigningPostActions = false;
    }),

    [actionCreators.doFetchClosingData]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingClosingData = true;
    }),
    [actionCreators.doFetchClosingDataSuccess]: produce((draft, { payload }) => {
      draft.closingData = payload.data;
      draft.isFetchingClosingData = false;
    }),
    [actionCreators.doFetchClosingDataFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingClosingData = false;
    }),

    [actionCreators.doRequestClosing]: produce((draft) => {
      draft.errorMessage = null;
      draft.isUpdatingClosing = true;
    }),
    [actionCreators.doRequestClosingSuccess]: produce((draft) => {
      // draft.closingData = payload.data.confirmations;
      draft.isUpdatingClosing = false;
    }),
    [actionCreators.doRequestClosingFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isUpdatingClosing = false;
    }),

    [actionCreators.doConfirmClosing]: produce((draft) => {
      draft.errorMessage = null;
      draft.isUpdatingClosing = true;
    }),
    [actionCreators.doConfirmClosingSuccess]: produce((draft) => {
      draft.isUpdatingClosing = false;
    }),
    [actionCreators.doConfirmClosingFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isUpdatingClosing = false;
    }),

    [actionCreators.doInitializeClosing]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doInitializeClosingSuccess]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.message = payload;
    }),
    [actionCreators.doInitializeClosingFailure]: produce((draft, { payload }) => {
      draft.errorMessage = payload;
      draft.isRequesting = false;
    }),

    [actionCreators.doCompleteClosing]: produce((draft) => {
      draft.errorMessage = null;
      draft.isUpdatingClosing = true;
    }),
    [actionCreators.doCompleteClosingSuccess]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isUpdatingClosing = false;
    }),
    [actionCreators.doCompleteClosingFailure]: produce((draft, { payload }) => {
      draft.errorMessage = payload;
      draft.isUpdatingClosing = false;
    }),
    [actionCreators.doFetchAdmissionTermsheetData]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingAdmissionTermsheetData = true;
      draft.termsheet = null;
    }),
    [actionCreators.doFetchAdmissionTermsheetDataSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.admissionTermsheetData = data;
        draft.isFetchingAdmissionTermsheetData = false;
      }
    ),
    [actionCreators.doFetchAdmissionTermsheetDataFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingAdmissionTermsheetData = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchAdmissionTerms]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingAdmissionTerms = true;
      draft.termsheet = null;
    }),
    [actionCreators.doFetchAdmissionTermsSuccess]: produce((draft, { payload: { data } }) => {
      draft.admissionTerms = data;
      draft.isFetchingAdmissionTerms = false;
    }),
    [actionCreators.doFetchAdmissionTermsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingAdmissionTerms = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doSetAdmissionTermsObjectURL]: produce((draft, { payload: { url } }) => {
      draft.admissionTermsObjectURL = url;
    }),
    [actionCreators.doClearAdmissionTermsObjectURL]: produce((draft) => {
      draft.admissionTermsObjectURL = undefined;
    }),
    [actionCreators.doFetchEngagementObligorProposal]: produce((draft) => {
      draft.isFetchingEngagementObligorProposalSignedDocURL = true;
      draft.errorMessage = undefined;
    }),
    [actionCreators.doFetchEngagementObligorProposalSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isFetchingEngagementObligorProposalSignedDocURL = false;
        draft.engagementObligorProposalSignedDocURL = data;
      }
    ),
    [actionCreators.doFetchEngagementObligorProposalFailure]: produce((draft, { payload }) => {
      draft.isFetchingEngagementObligorProposalSignedDocURL = false;
      draft.errorMessage = payload;
      draft.engagementObligorProposalSignedDocURL = undefined;
    }),
    [actionCreators.doSubmitBypassSignedEngagement]: produce((draft) => {
      draft.isSubmittingBypassSignedEngagement = true;
      draft.hasSubmittedBypassSignedEnagagement = false;
    }),
    [actionCreators.doSubmitBypassSignedEngagementSuccess]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSubmittingBypassSignedEngagement = false;
      draft.hasSubmittedBypassSignedEnagagement = true;
    }),
    [actionCreators.doSubmitBypassSignedEngagementFailure]: produce((draft, { payload }) => {
      draft.errorMessage = payload;
    }),
    [actionCreators.doSubmitAdmissionTerms]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmittingAdmissionTerms = true;
      draft.termsheet = null;
    }),
    [actionCreators.doSubmitAdmissionTermsSuccess]: produce((draft) => {
      draft.isSubmittingAdmissionTerms = false;
    }),
    [actionCreators.doSubmitAdmissionTermsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isSubmittingAdmissionTerms = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchAdmissionStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingStatus = true;
      draft.termsheet = null;
    }),
    [actionCreators.doFetchAdmissionStatusSuccess]: produce((draft, { payload: { data } }) => {
      draft.sukukStatus = data.payload;
      draft.isFetchingStatus = false;
    }),
    [actionCreators.doFetchAdmissionStatusFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingStatus = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchIssuers]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingIssuers = true;
    }),
    [actionCreators.doFetchIssuersSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { clients },
          },
        }
      ) => {
        draft.issuers = clients;
        draft.isFetchingIssuers = false;
      }
    ),
    [actionCreators.doFetchIssuersFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingIssuers = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchCMAIssuanceApprovalStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchCMAIssuanceApprovalStatusSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.capitalMarketAuthorityData = { ...draft.capitalMarketAuthorityData, ...data };
        draft.isFetching = false;
      }
    ),
    [actionCreators.doFetchCMAIssuanceApprovalStatusFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchCMASPEIncorporationApprovalStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchCMASPEIncorporationApprovalStatusSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.capitalMarketAuthorityData = { ...draft.capitalMarketAuthorityData, ...data };
        draft.isFetching = false;
      }
    ),
    [actionCreators.doFetchCMASPEIncorporationApprovalStatusFailure]: produce(
      (draft, { payload }) => {
        draft.isFetching = false;
        draft.errorMessage = payload;
      }
    ),
    [actionCreators.doConfirmCMAIssuanceApprovalStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doConfirmCMAIssuanceApprovalStatusSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.message = data;
        draft.isRequesting = false;
      }
    ),
    [actionCreators.doConfirmCMAIssuanceApprovalStatusFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doConfirmCMASPEIncorporationApprovalStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doConfirmCMASPEIncorporationApprovalStatusSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.message = data;
        draft.isRequesting = false;
      }
    ),
    [actionCreators.doConfirmCMASPEIncorporationApprovalStatusFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),
    [actionCreators.doFetchCMADocs]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doFetchCMADocsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { cmaRelatedDocumentURLS },
          },
        }
      ) => {
        draft.capitalMarketAuthorityDocumentURLs = { ...cmaRelatedDocumentURLS };
        draft.isRequesting = false;
      }
    ),
    [actionCreators.doFetchCMADocsFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchAllIssuances]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingIssuances = true;
    }),
    [actionCreators.doFetchAllIssuancesSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.allIssuances = data;
        draft.isFetchingIssuances = false;
      }
    ),
    [actionCreators.doFetchAllIssuancesFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingIssuances = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doResetCMADocumentURLsState]: produce((draft) => {
      draft.capitalMarketAuthorityDocumentURLs = null;
    }),
    [actionCreators.doRequestSignature]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doRequestSignatureSuccess]: produce((draft, { payload: { data } }) => {
      draft.message = data;
      draft.isRequesting = false;
    }),
    [actionCreators.doRequestSignatureFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchIssuancesByStatus]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doFetchIssuancesByStatusSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { issuances },
          },
        }
      ) => {
        draft.isRequesting = false;
        draft.allIssuances = issuances;
      }
    ),
    [actionCreators.doFetchIssuancesByStatusFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doResetIssuanceTermsheet]: produce((draft) => {
      draft.termsheet = {};
    }),
    [actionCreators.doAddCoArranger]: produce((draft) => {
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [actionCreators.doAddCoArrangerSuccess]: produce((draft, { payload: { data } }) => {
      draft.message = data;
      draft.isRequesting = false;
    }),
    [actionCreators.doAddCoArrangerFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
  },

  defaultState
);

export default issuanceReducers;
