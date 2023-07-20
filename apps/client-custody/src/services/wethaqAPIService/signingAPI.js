import { baseAxiosInstance } from "./helpers";

const signingFetchPreAction = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/signing/${payload.sukukId}/preActions`,
  });

const signingPreAction = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `v1/signing/${payload.sukukId}/preActions`,
  });

const updateSigningPostAction = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `v1/signing/${payload.sukukId}/updatePostSigning`,
  });

const getSigningPostActions = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/signing/${payload.sukukId}/postSigning`,
  });

const fetchCompleteAgenda = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/signing/${payload.sukukId}/completeAgenda`,
  });

const fetchReviewDocs = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/signing/${payload.sukukId}/reviewDocs`,
  });

const uploadExecDoc = (payload) =>
  baseAxiosInstance({
    method: "POST",
    config: { headers: { "Content-Type": "multipart/form-data" } },
    data: payload.requestPayload,
    url: `v1/signing/${payload.sukukId}/uploadExecutionDoc`,
  });

const sendForSigning = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `v1/signing/${payload.sukukId}/document/${payload.documentId}/sendForSigning`,
  });

const uploadReviewDoc = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `v1/signing/${payload.sukukId}/uploadReviewDoc`,
  });

const sendReviewForSigning = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/signing/${payload.sukukId}/document/${payload.documentName}/send`,
  });

const getDocusignLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/signing/${payload.sukukId}/document/${payload.documentId}/signUrl`,
  });

const getAuthlessDocusignLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/signing/${payload.token}/signUrl`,
  });

const getReviewDocusignLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/signing/${payload.sukukId}/document/${payload.documentId}`,
  });

const completeDoc = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `v1/signing/${payload.sukukId}/complete/${payload.documentId}`,
  });

const fetchAgenda = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/signing/${payload.sukukId}/agenda`,
  });

const signingAPI = {
  signingFetchPreAction,
  signingPreAction,
  updateSigningPostAction,
  getSigningPostActions,
  fetchCompleteAgenda,
  fetchReviewDocs,
  uploadExecDoc,
  sendForSigning,
  uploadReviewDoc,
  sendReviewForSigning,
  getDocusignLink,
  getAuthlessDocusignLink,
  getReviewDocusignLink,
  completeDoc,
  fetchAgenda,
};

export default signingAPI;
