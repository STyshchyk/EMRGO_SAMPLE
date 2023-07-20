import { baseAxiosInstance } from "./helpers";

export const createIssuance = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `v1/sukuk/launch`,
  });

export const finalizeIssuanceTermsheet = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/sukuk/termsheet/finalize/${payload.sukukId}`,
  });

export const getIssuances = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/dashboard`,
  });

const getIssuanceOverview = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/overview/${payload.sukukId}`,
  });

const getIssuanceTermsheet = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/termsheet/${payload.sukukId}`,
  });

export const saveIssuanceTermsheet = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload.requestPayload,
    url: `/v1/sukuk/termsheet/${payload.sukukId}`,
  });

export const reviewIssuanceTermsheet = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/sukuk/termsheet/sendForReview/${payload.sukukId}`,
  });

const inviteInvestors = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `v1/sukuk/${payload.sukukId}/investors/invite`,
  });

const getFinalterms = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/termsheet/finalterms/${payload.sukukId}`,
  });

const approveTermsheet = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/sukuk/termsheet/approve/${payload.sukukId}`,
  });

const getCMADocumentURLS = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/${payload.sukukId}/cma/document-urls`,
  });

const getCMAIssuanceApprovalStatus = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/${payload.sukukId}/cma/issuance-approval/confirm`,
  });

const getCMASPEIncorporationApprovalStatus = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/${payload.sukukId}/cma/spe-incorporation-approval/confirm`,
  });

const confirmCMAIssuanceApprovalStatus = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/sukuk/${payload.sukukId}/cma/issuance-approval/confirm`,
    data: payload.requestPayload,
  });

const confirmCMASPEIncorporationApprovalStatus = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/sukuk/${payload.sukukId}/cma/spe-incorporation-approval/confirm`,
    data: payload.requestPayload,
  });

export const getAllIssuances = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/sukuk/list`,
  });

export const getAllIssuancesByStatus = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/sukuk/fetch?status=${payload.status}`,
    data: payload.requestPayload,
  });

export const addCoArranger = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/sukuk/${payload.sukukId}/co-arranger/`,
    data: payload.requestPayload,
  });

const sukukAPI = {
  createIssuance,
  finalizeIssuanceTermsheet,
  getIssuanceOverview,
  getIssuances,
  getIssuanceTermsheet,
  saveIssuanceTermsheet,
  reviewIssuanceTermsheet,
  inviteInvestors,
  getFinalterms,
  approveTermsheet,
  getCMADocumentURLS,
  getCMAIssuanceApprovalStatus,
  confirmCMAIssuanceApprovalStatus,
  getCMASPEIncorporationApprovalStatus,
  confirmCMASPEIncorporationApprovalStatus,
  getAllIssuances,
  getAllIssuancesByStatus,
  addCoArranger,
};

export default sukukAPI;
