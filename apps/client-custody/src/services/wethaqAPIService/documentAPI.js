import { baseAxiosInstance } from "./helpers";

export const getUsers = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/users/issuance/${payload.sukukId}`,
  });

export const getUploadLink = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/files/upload/link`,
    data: payload,
  });

export const processFile = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/files/process`,
    data: payload,
  });

export const getUserFiles = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/files?sukukId=${payload.sukukId}`,
  });

export const getDownloadLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/files/${payload.documentId}/download`,
  });

export const getPreviewLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/files/${payload.documentId}/view`,
  });

export const getDocusignURL = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/signing/${payload.sukukId}/document/${payload.documentId}/signUrl`,
    params: {
      transactionId: payload?.transactionId ?? undefined,
    },
  });

export const updateDocumentPermissions = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/kyc/supportingDocumentPermission`,
    data: payload,
  });

export const requestDocumentUpload = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/kyc/supportingDocuments/process`,
    data: payload,
  });

export const markDocumentObtained = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/v1/kyc/supportingDocuments/process`,
    data: payload,
  });

const documentAPI = {
  getUsers,
  getUploadLink,
  processFile,
  getUserFiles,
  getDownloadLink,
  getPreviewLink,
  getDocusignURL,
  updateDocumentPermissions,
  requestDocumentUpload,
  markDocumentObtained,
};

export default documentAPI;
