import { baseAxiosInstance } from './helpers';

// TODO: Update the URL once MR #469 is merged
// TODO: to be replaced with POST /v1/issuances/:issuanceID/termsheet
const engageServiceProvidersForLA = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/engagement/terms/${payload.id}/save`,
    data: payload.requestPayload,
  });

const engageServiceProvidersForSP = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    url: `/v1/engagement/terms/${payload.id}/accept`,
  });

const fetchEngagementLetter = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/engagement/letter/${payload.id}`,
  });

const fetchEngagementLetterUrl = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/engagement/${payload.sukukId}/letter/${payload.engagementId}`,
    params: {
      transactionId: payload?.transactionId ?? undefined,
    },
  });

const fetchEngagementRequests = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/engagement`,
  });

const fetchEngagementStatus = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/engagement/status/${payload.engagementId}`,
  });

const fetchServiceProviders = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/engagement/providers/${payload.id}`,
  });

const requestServiceProviderEngagement = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/engagement/terms/${payload.sukukId}/request`,
    data: payload.requestPayload,
  });

const sendDocumentForSignature = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/engagement/${payload.engagementId}/terms/${payload.sukukId}/signature`,
  });

const uploadEngagementLetter = (payload) =>
  baseAxiosInstance({
    method: 'PUT',
    config: { headers: { 'Content-Type': 'multipart/form-data' } },
    url: `/v1/engagement/${payload.engagementId}/terms/${payload.sukukId}/upload`,
    data: payload.requestPayload,
  });

const fetchObligorEngagementProposal = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/engagement/proposal/obligor`,
  });

const submitBypassSignedEngagement = (payload) =>
  baseAxiosInstance({
    method: 'PUT',
    url: `/v1/engagement/${payload.sukukId}/letter/${payload.engagementId}/bypass/sign`,
  });

const engagementsAPI = {
  engageServiceProvidersForLA,
  engageServiceProvidersForSP,
  fetchEngagementLetter,
  fetchEngagementLetterUrl,
  fetchEngagementRequests,
  fetchEngagementStatus,
  fetchServiceProviders,
  requestServiceProviderEngagement,
  sendDocumentForSignature,
  uploadEngagementLetter,
  fetchObligorEngagementProposal,
  submitBypassSignedEngagement,
};

export default engagementsAPI;
