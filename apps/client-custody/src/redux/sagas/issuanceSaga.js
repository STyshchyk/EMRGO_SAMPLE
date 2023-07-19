/* eslint-disable */

import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import i18n from '../../i18n';
import * as issuanceActionCreators from '../actionCreators/issuance';
import * as issuanceActionTypes from '../actionTypes/issuance';
import * as wethaqAPIService from '../../services/wethaqAPIService';
import * as s3Service from '../../services/s3Service';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchIssuances() {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getIssuances);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchIssuancesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchIssuancesFailure(errorMessage));
  }
}

function* createIssuance({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.createIssuance, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doCreateIssuanceSuccess({ data }));
    yield put(issuanceActionCreators.doFetchIssuances());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doCreateIssuanceFailure(errorMessage));
  }
}

function* fetchIssuanceOverview({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getIssuanceOverview, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchIssuanceOverviewSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchIssuanceOverviewFailure(errorMessage));
  }
}

function* fetchIssuerCliens({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.getIssuerClients, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchIssuerClientsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchIssuerClientsFailure(errorMessage));
  }
}

function* fetchCoArrangers({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.getCoArrangers, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchCoArrangersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchCoArrangersFailure(errorMessage));
  }
}

function* fetchFormOptions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchFormOptionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchFormOptionsFailure(errorMessage));
  }
}

function* fetchTermsheet({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getIssuanceTermsheet, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchTermsheetSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchTermsheetFailure(errorMessage));
  }
}

function* saveTermsheet({ payload }) {
  // save api allows to save data partially on the termsheet
  try {
    const response = yield call(wethaqAPIService.sukukAPI.saveIssuanceTermsheet, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSaveTermsheetSuccess({ data }));
    yield call(toast.success, data.message || i18n.t('Termsheet updated successfully'));
    yield put(issuanceActionCreators.doUpdateSaveTermsheetState(true)); //has Saved termsheet boolean
    yield put(issuanceActionCreators.doFetchTermsheet({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSaveTermsheetFailure(errorMessage));
  }
}

function* publishTermsheet({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.saveIssuanceTermsheet, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSaveTermsheetSuccess({ data }));
    yield call(toast.success, i18n.t('Termsheet published successfully'));
    yield put(issuanceActionCreators.doFetchTermsheet({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSaveTermsheetFailure(errorMessage));
  }
}

function* reviewTermsheet({ payload }) {
  // review api effects arrangerReviewRequired
  try {
    const response = yield call(wethaqAPIService.sukukAPI.reviewIssuanceTermsheet, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doReviewTermsheetSuccess({ data }));
    yield call(toast.success, data.message || i18n.t('Termsheet sent for review successfully'));
    yield put(issuanceActionCreators.doFetchTermsheet({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doReviewTermsheetFailure(errorMessage));
  }
}

function* finalizeTermsheet({ payload }) {
  // finalize api throws the error if my fields aren't all filled and also changes status to subscription
  try {
    const response = yield call(wethaqAPIService.sukukAPI.finalizeIssuanceTermsheet, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFinalizeTermsheetSuccess({ data }));
    yield call(toast.success, data.message || i18n.t('Termsheet updated successfully'));
    yield put(issuanceActionCreators.doFetchTermsheet({ sukukId: payload.sukukId }));
    yield put(issuanceActionCreators.doFetchIssuanceOverview({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFinalizeTermsheetFailure(errorMessage));
  }
}

function* fetchFinalterms({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getFinalterms, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchFinaltermsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchFinaltermsFailure(errorMessage));
  }
}

function* approveTermsheet({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.approveTermsheet, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doApproveTermsheetSuccess({ data }));
    yield put(issuanceActionCreators.doFetchTermsheet({ sukukId: payload.sukukId }));
    yield call(toast.success, data?.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doApproveTermsheetFailure(errorMessage));
  }
}

function* fetchInvestors({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.getInvestors, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchInvestorsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchInvestorsFailure(errorMessage));
  }
}

function* inviteInvestors({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.inviteInvestors, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doInviteInvestorsSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doFetchInvestors({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doInviteInvestorsFailure(errorMessage));
  }
}

function* sendSubscription({ payload }) {
  try {
    const response = yield call(wethaqAPIService.subscriptionsAPI.sendSubscription, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSendSubscriptionSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doFetchTermsheet({ sukukId: payload.sukukId }));
    yield put(issuanceActionCreators.doFetchSubscription({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSendSubscriptionFailure(errorMessage));
  }
}

function* fetchSubscription({ payload }) {
  try {
    const response = yield call(wethaqAPIService.subscriptionsAPI.getSubscriptions, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchSubscriptionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchSubscriptionFailure(errorMessage));
  }
}

function* confirmSubscription({ payload }) {
  try {
    const response = yield call(wethaqAPIService.subscriptionsAPI.confirmSubscription, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doConfirmSubscriptionSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doFetchSubscription({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doConfirmSubscriptionFailure(errorMessage));
  }
}

function* finaliseSubscription({ payload }) {
  try {
    const response = yield call(wethaqAPIService.subscriptionsAPI.finaliseSubscription, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFinaliseSubscriptionSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doFetchSubscription({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFinaliseSubscriptionFailure(errorMessage));
  }
}

function* fetchServiceProvides({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.fetchServiceProviders, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchServiceProvidersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchServiceProvidersFailure(errorMessage));
  }
}

function* engageServiceProvider({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.requestServiceProviderEngagement, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doEngageServiceProviderSuccess({ data }));
    yield put(issuanceActionCreators.doFetchServiceProviders({ id: payload.sukukId }));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doEngageServiceProviderFailure(errorMessage));
  }
}

function* fetchEngagementRequests({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.fetchEngagementRequests, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchEngagementRequestsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchEngagementRequestsFailure(errorMessage));
  }
}

const handleUploadEngagementLetter = (files, engagementId, sukukId) => {
  if (!files.length) return;
  const payload = {
    sukukId,
    engagementId,
    requestPayload: {
      engagementLetter: files[0].file,
    },
  };
  if (!files[0]?.file?.name) {
    return;
  }
  doUploadEngagementLetter(payload);
};

function* uploadEngagementLetter({ payload }) {
  try {
    // const { requestPayload, sukukId, engagementId } = payload;
    const response = yield call(wethaqAPIService.engagementsAPI.uploadEngagementLetter, payload);
    const { data } = response;

    yield call(s3Service.putFile, {
      uploadURLData: data?.data?.uploadUrl,
      file: payload?.requestPayload.engagementLetter,
    });

    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doFetchEngagementRequests());
    yield put(issuanceActionCreators.doUploadEngagementLetterSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doUploadEngagementLetterFailure({ errorMessage, payload }));
  }
}

function* requestEngagementLetterSigning({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.sendDocumentForSignature, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(issuanceActionCreators.doRequestSignatureSuccess({ data }));
    yield put(issuanceActionCreators.doFetchEngagementRequests());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doRequestSignatureFailure(errorMessage));
  }
}

function* fetchEngagementLetterUrl({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.fetchEngagementLetterUrl, payload.requestPayload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchEngagementLetterUrlSuccess({ data }));

    if (typeof payload?.successCallback === 'function') {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchEngagementLetterUrlFailure(errorMessage));
  }
}

function* fetchEngagementStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.fetchEngagementStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchEngagementLetterUrlSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchEngagementLetterUrlFailure(errorMessage));
  }
}

function* submitBypassSignedEngagement({ payload }) {
  const { requestPayload, successCallback } = payload;
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.submitBypassSignedEngagement, requestPayload);
    const { data } = response;
    yield put(issuanceActionCreators.doSubmitBypassSignedEngagementSuccess({ data }));
    if (successCallback) {
      successCallback();
    }
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSubmitBypassSignedEngagementFailure(errorMessage));
  }
}

function* fetchPreActionSigning({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.signingFetchPreAction, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSigningFetchPreActionSuccess({ data }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSigningFetchPreActionSuccess(errorMessage));
  }
}

function* preActionSigning({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.signingPreAction, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSigningPreActionSuccess({ data }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSigningPreActionFailure(errorMessage));
  }
}

function* fetchCompleteAgenda({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.fetchCompleteAgenda, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSigningFetchCompleteAgendaSuccess({ data }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSigningFetchCompleteAgendaFailure(errorMessage));
  }
}

function* uploadExecDocument({ payload }) {
  yield call(toast.info, `${i18n.t('messages:Uploading')} ${payload.requestPayload.originalFileName}`);
  try {
    const requestParams = {
      sukukId: payload.sukukId,
      requestPayload: payload.requestPayload,
    };
    const response = yield call(wethaqAPIService.signingAPI.uploadExecDoc, requestParams);
    const { data } = response;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t('messages:Uploaded')} ${payload.requestPayload.originalFileName}`);
    yield put(issuanceActionCreators.doUploadExecDocsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doUploadExecDocsFailure(errorMessage));
  }
}

function* sendExecDocumentForSigning({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.sendForSigning, payload);
    const { data } = response;
    if (data.message) {
      yield call(toast.success, data.message);
    }
    yield put(issuanceActionCreators.doSendExecDocsSuccess({ data }));
    const nextPayload = {
      sukukId: payload.sukukId,
    };
    yield put(issuanceActionCreators.doSigningFetchCompleteAgenda(nextPayload));
    // yield call(toast.success, response.data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSendExecDocsFailure(errorMessage));
  }
}

function* sendReviewDocumentForSigning({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.sendReviewForSigning, payload);
    const { data } = response;
    if (data.message) {
      yield call(toast.success, data.message);
    }
    yield put(issuanceActionCreators.doSendReviewDocsSuccess({ data }));
    const nextPayload = {
      sukukId: payload.sukukId,
    };
    yield put(issuanceActionCreators.doSigningReviewDocs(nextPayload));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSendReviewDocsFailure(errorMessage));
  }
}

// * Dev Comment: Request for a Pre-signed AWS S3 URL from wethaq API & Upload direct to S3 with Pre-signed POST request
function* uploadReviewDocument({ payload }) {
  yield call(toast.info, i18n.t('messages:Uploading Document Please wait'));

  try {
    const response = yield call(wethaqAPIService.signingAPI.uploadReviewDoc, payload.requestPayload);
    const { data } = response;

    yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload?.file,
    });

    yield call(toast.success, `${i18n.t('messages:Uploaded')} ${payload.requestPayload.originalFileName}`);
    yield put(issuanceActionCreators.doSigningReviewDocs({ sukukId: payload.requestPayload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doUploadReviewDocsFailure(errorMessage));
  }
}

function* fetchDocusignLink({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.getDocusignLink, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchDocusignLinkSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchDocusignLinkFailure(errorMessage));
  }
}

function* fetchAuthlessDocusignLink({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.getAuthlessDocusignLink, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchAuthlessDocusignLinkSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchAuthlessDocusignLinkFailure(errorMessage));
  }
}

function* fetchReviewDocusignLink({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.getReviewDocusignLink, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchReviewDocusignLinkSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchReviewDocusignLinkFailure(errorMessage));
  }
}

function* completeDocs({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.completeDoc, payload);
    const { data } = response;
    if (data.message) {
      yield call(toast.success, data.message);
    }
    yield put(issuanceActionCreators.doSigningFetchCompleteAgenda(payload));
    yield put(issuanceActionCreators.doCompleteDocumentSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doCompleteDocumentFailure(errorMessage));
  }
}

function* fetchAgenda({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.fetchAgenda, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSigningFetchAgendaSuccess({ data }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSigningFetchAgendaFailure(errorMessage));
  }
}

function* fetchReviewDocs({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.fetchReviewDocs, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSigningReviewDocsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSigningReviewDocsFailure(errorMessage));
  }
}

function* fetchPostSigningActions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.getSigningPostActions, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchSigningPostActionSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchSigningPostActionFailure(errorMessage));
  }
}

function* updatePostSigning({ payload }) {
  try {
    const response = yield call(wethaqAPIService.signingAPI.updateSigningPostAction, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doUpdateSigningPostActionSuccess({ data }));
    yield put(issuanceActionCreators.doFetchSigningPostAction({ sukukId: payload.sukukId }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doUpdateSigningPostActionFailure(errorMessage));
  }
}

function* fetchClosingData({ payload }) {
  try {
    const response = yield call(wethaqAPIService.closingAPI.fetchClosing, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchClosingDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchClosingDataFailure(errorMessage));
  }
}

function* requestClosing({ payload }) {
  try {
    const response = yield call(wethaqAPIService.closingAPI.requestClosing, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doRequestClosingSuccess({ data }));
    yield put(issuanceActionCreators.doFetchIssuanceOverview({ sukukId: payload.sukukId }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doRequestClosingFailure(errorMessage));
  }
}

function* confirmClosing({ payload }) {
  try {
    const response = yield call(wethaqAPIService.closingAPI.confirmClosing, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doRequestClosingSuccess({ data }));
    yield put(issuanceActionCreators.doFetchClosingData({ sukukId: payload.sukukId }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doConfirmClosingFailure(errorMessage));
  }
}

function* initializeClosing({ payload }) {
  try {
    const response = yield call(wethaqAPIService.closingAPI.initializeClosing, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doInitializeClosingSuccess({ data }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
    yield put(issuanceActionCreators.doSigningFetchPreAction({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doInitializeClosingFailure(errorMessage));
  }
}

function* completeClosing({ payload }) {
  try {
    const response = yield call(wethaqAPIService.closingAPI.completeClosing, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doCompleteClosingSuccess({ data }));
    if (data.message) {
      yield call(toast.success, data.message);
    }
    yield put(issuanceActionCreators.doFetchIssuanceOverview({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doCompleteClosingFailure(errorMessage));
  }
}

function* fetchAdmissionTermsheet({ payload }) {
  try {
    const response = yield call(wethaqAPIService.admissionAPI.getAdmissionTermsheetDetails, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchAdmissionTermsheetDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchAdmissionTermsheetDataFailure(errorMessage));
  }
}

function* fetchAdmissionTerms({ payload }) {
  try {
    const response = yield call(wethaqAPIService.admissionAPI.getAdmissionTerms, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchAdmissionTermsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchAdmissionTermsFailure(errorMessage));
  }
}

function* fetchEngagementObligorProposalSignedDoc() {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.fetchObligorEngagementProposal);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchEngagementObligorProposalSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchEngagementObligorProposalFailure(errorMessage));
  }
}

function* submitAdmissionTerms({ payload }) {
  try {
    const response = yield call(wethaqAPIService.admissionAPI.submitAdmissionTerms, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doSubmitAdmissionTermsSuccess({ data }));
    yield put(issuanceActionCreators.doFetchAdmissionStatus(payload));
    yield call(toast.success, data.message);
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doSubmitAdmissionTermsFailure(errorMessage));
  }
}

function* fetchAdmissionStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.admissionAPI.getSukukStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchAdmissionStatusSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchAdmissionStatusFailure(errorMessage));
  }
}

function* fetchIssuers({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.getIssuers, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchIssuersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchIssuersFailure(errorMessage));
  }
}

function* fetchCMAIssuanceApprovalStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getCMAIssuanceApprovalStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchCMAIssuanceApprovalStatusSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchCMAIssuanceApprovalStatusFailure(errorMessage));
  }
}

function* fetchCMASPEIncorporationApprovalStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getCMASPEIncorporationApprovalStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchCMASPEIncorporationApprovalStatusSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchCMASPEIncorporationApprovalStatusFailure(errorMessage));
  }
}

function* confirmCMAIssuanceApprovalStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.confirmCMAIssuanceApprovalStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doConfirmCMAIssuanceApprovalStatusSuccess({ data }));
    yield put(issuanceActionCreators.doFetchCMAIssuanceApprovalStatus({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doConfirmCMAIssuanceApprovalStatusFailure(errorMessage));
  }
}

function* confirmCMASPEIncorporationApprovalStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.confirmCMASPEIncorporationApprovalStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doConfirmCMASPEIncorporationApprovalStatusSuccess({ data }));
    yield put(issuanceActionCreators.doFetchCMASPEIncorporationApprovalStatus({ sukukId: payload.sukukId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doConfirmCMASPEIncorporationApprovalStatusFailure(errorMessage));
  }
}

function* fetchCMARelatedDocumentURLS({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getCMADocumentURLS, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchCMADocsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchCMADocsFailure(errorMessage));
  }
}

function* uploadCMARelatedDocument({ payload }) {
  try {
    const response = yield call(wethaqAPIService.fileAPI.upload, { type: 'capitalMarketAuthority', ...payload.requestPayload });
    const { data } = response;

    data.name = payload.requestPayload.name;
    data.keyName = payload.keyName;

    const s3APIResponse = yield call(s3Service.putFile, {
      uploadURLData: data?.uploadUrl,
      file: payload.file,
    });

    yield call(toast.success, `${i18n.t('messages:Uploaded')} ${payload.requestPayload.fileName}`);

    yield put(issuanceActionCreators.doUploadCMARelatedDocSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doUploadCMARelatedDocFailure({ message: errorMessage, key: payload.keyName }));
  }
}

function* fetchAllIssuances() {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getAllIssuances);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchAllIssuancesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchAllIssuancesFailure(errorMessage));
  }
}

function* fetchIssuancesByStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.getAllIssuancesByStatus, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doFetchIssuancesByStatusSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doFetchIssuancesByStatusFailure(errorMessage));
  }
}

function* addCoArranger({ payload }) {
  try {
    const response = yield call(wethaqAPIService.sukukAPI.addCoArranger, payload);
    const { data } = response;
    yield put(issuanceActionCreators.doAddCoArrangerSuccess({ data }));

    if (typeof payload?.successCallback === 'function') {
      yield call(toast.success, data.message);
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(issuanceActionCreators.doAddCoArrangerFailure(errorMessage));
  }
}

const issuanceSaga = [
  takeLatest(issuanceActionTypes.ISSUANCES_FETCH_REQUESTED, fetchIssuances),
  takeLatest(issuanceActionTypes.ISSUANCE_CREATE_REQUESTED, createIssuance),
  takeLatest(issuanceActionTypes.ISSUANCE_OVERVIEW_FETCH_REQUESTED, fetchIssuanceOverview),
  takeLatest(issuanceActionTypes.ISSUER_CLIENTS_FETCH_REQUESTED, fetchIssuerCliens),
  takeLatest(issuanceActionTypes.CO_ARRANGERS_FETCH_REQUESTED, fetchCoArrangers),
  takeEvery(issuanceActionTypes.FORM_OPTIONS_FETCH_REQUESTED, fetchFormOptions),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_FETCH_REQUESTED, fetchTermsheet),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_SAVE_REQUESTED, saveTermsheet),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_PUBLISH_REQUESTED, publishTermsheet),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_REVIEW_REQUESTED, reviewTermsheet),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_FINALIZE_REQUESTED, finalizeTermsheet),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_FINAL_TERMS_REQUESTED, fetchFinalterms),
  takeLatest(issuanceActionTypes.ISSUANCE_TERMSHEET_APPROVE_REQUESTED, approveTermsheet),
  takeLatest(issuanceActionTypes.INVESTORS_FETCH_REQUESTED, fetchInvestors),
  takeLatest(issuanceActionTypes.INVESTORS_INVITE_REQUESTED, inviteInvestors),
  takeLatest(issuanceActionTypes.SUBSCRIPTION_SEND_REQUESTED, sendSubscription),
  takeLatest(issuanceActionTypes.SUBSCRIPTION_FETCH_REQUESTED, fetchSubscription),
  takeLatest(issuanceActionTypes.SUBSCRIPTION_CONFIRM_REQUESTED, confirmSubscription),
  takeLatest(issuanceActionTypes.SUBSCRIPTION_FINALISE_REQUESTED, finaliseSubscription),
  takeLatest(issuanceActionTypes.SERVICE_PROVIDER_FETCH_REQUESTED, fetchServiceProvides),
  takeLatest(issuanceActionTypes.SERVICE_PROVIDER_ENGAGEMENT_REQUESTED, engageServiceProvider),
  takeLatest(issuanceActionTypes.ENGAGEMENT_REQUESTS_FETCH_REQUESTED, fetchEngagementRequests),
  takeLatest(issuanceActionTypes.ENGAGEMENT_LETTER_UPLOAD_REQUESTED, uploadEngagementLetter),
  takeLatest(issuanceActionTypes.ENGAGEMENT_LETTER_SIGNATURE_REQUESTED, requestEngagementLetterSigning),
  takeLatest(issuanceActionTypes.ENGAGEMENT_LETTER_URL_FETCH_REQUESTED, fetchEngagementLetterUrl),
  takeLatest(issuanceActionTypes.ENGAGEMENT_STATUS_FETCH_REQUESTED, fetchEngagementStatus),
  takeLatest(issuanceActionTypes.SUBMIT_BYPASS_SIGNED_ENGAGEMENT_REQUESTED, submitBypassSignedEngagement),
  takeLatest(issuanceActionTypes.SIGNING_FETCH_PREACTION_REQUESTED, fetchPreActionSigning),
  takeLatest(issuanceActionTypes.SIGNING_PREACTION_REQUESTED, preActionSigning),
  takeLatest(issuanceActionTypes.SIGNING_COMPLETE_AGENDA_REQUESTED, fetchCompleteAgenda),
  takeEvery(issuanceActionTypes.UPLOAD_EXEC_DOC_REQUESTED, uploadExecDocument),
  takeLatest(issuanceActionTypes.DOCUSIGN_LINK_REQUESTED, fetchDocusignLink),
  takeLatest(issuanceActionTypes.AUTHLESS_DOCUSIGN_LINK_REQUESTED, fetchAuthlessDocusignLink),
  takeLatest(issuanceActionTypes.REVIEW_DOCUSIGN_LINK_REQUESTED, fetchReviewDocusignLink),
  takeLatest(issuanceActionTypes.COMPLETE_DOCUMENT_REQUESTED, completeDocs),
  takeLatest(issuanceActionTypes.SIGNING_AGENDA_REQUESTED, fetchAgenda),
  takeLatest(issuanceActionTypes.SIGNING_REVIEW_DOCS_REQUESTED, fetchReviewDocs),
  takeLatest(issuanceActionTypes.UPLOAD_REVIEW_DOC_REQUESTED, uploadReviewDocument),
  takeLatest(issuanceActionTypes.SIGNING_POSTACTION_FETCH_REQUESTED, fetchPostSigningActions),
  takeLatest(issuanceActionTypes.SIGNING_POSTACTION_UPDATE_REQUESTED, updatePostSigning),
  takeLatest(issuanceActionTypes.CLOSING_DATA_REQUESTED, fetchClosingData),
  takeLatest(issuanceActionTypes.CLOSING_REQUEST_REQUESTED, requestClosing),
  takeLatest(issuanceActionTypes.CLOSING_CONFIRMATION_REQUESTED, confirmClosing),
  takeLatest(issuanceActionTypes.CLOSING_INITIALIZATION_REQUESTED, initializeClosing),
  takeLatest(issuanceActionTypes.CLOSING_COMPLETE_REQUESTED, completeClosing),
  takeLatest(issuanceActionTypes.SEND_EXEC_DOC_REQUESTED, sendExecDocumentForSigning),
  takeLatest(issuanceActionTypes.SEND_REVIEW_DOC_REQUESTED, sendReviewDocumentForSigning),
  takeLatest(issuanceActionTypes.ADMISSION_TERMSHEET_DATA_REQUESTED, fetchAdmissionTermsheet),
  takeLatest(issuanceActionTypes.ADMISSION_TERMS_REQUESTED, fetchAdmissionTerms),
  takeLatest(issuanceActionTypes.ENGAGEMENT_OBLIGOR_PROPOSAL_FETCH_REQUESTED, fetchEngagementObligorProposalSignedDoc),
  takeLatest(issuanceActionTypes.SUBMIT_ADMISSION_TERMS_REQUESTED, submitAdmissionTerms),
  takeLatest(issuanceActionTypes.FETCH_ADMISSION_STATUS_REQUESTED, fetchAdmissionStatus),
  takeLatest(issuanceActionTypes.ISSUERS_FETCH_REQUESTED, fetchIssuers),
  takeLatest(issuanceActionTypes.FETCH_CMA_ISSUANCE_APPROVAL_STATUS_REQUESTED, fetchCMAIssuanceApprovalStatus),
  takeLatest(issuanceActionTypes.FETCH_CMA_SPE_INCORPORATION_APPROVAL_STATUS_REQUESTED, fetchCMASPEIncorporationApprovalStatus),
  takeLatest(issuanceActionTypes.CONFIRM_CMA_ISSUANCE_APPROVAL_STATUS_REQUESTED, confirmCMAIssuanceApprovalStatus),
  takeLatest(issuanceActionTypes.CONFIRM_CMA_SPE_INCORPORATION_APPROVAL_STATUS_REQUESTED, confirmCMASPEIncorporationApprovalStatus),
  takeLatest(issuanceActionTypes.FETCH_CMA_DOCS_REQUESTED, fetchCMARelatedDocumentURLS),
  takeEvery(issuanceActionTypes.UPLOAD_CMA_RELATED_DOC_REQUESTED, uploadCMARelatedDocument),
  takeEvery(issuanceActionTypes.ISSUANCES_FETCH_ALL_REQUESTED, fetchAllIssuances),
  takeEvery(issuanceActionTypes.ISSUANCES_FETCH_BY_STATUS_REQUESTED, fetchIssuancesByStatus),
  takeLatest(issuanceActionTypes.ADD_CO_ARRANGER_REQUESTED, addCoArranger),
];

export default issuanceSaga;
