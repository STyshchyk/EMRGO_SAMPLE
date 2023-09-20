import { IDocument, ISignedURL, IUploadResponse, IUser } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";
import axios from "axios";

export const fetchPlatformDocument = async (params: {
  documentType: string;
}): Promise<IDocument> => {
  const promise = sharedDashboardApi({
    method: "get",
    url: `/auth/v2/platform/documents`,
    params,
  });
  const data = await (await promise).data?.data;
  return data || null;
};

export const fetchDocumentPath = async (requestPayload: {
  documentType: string;
}): Promise<IDocument> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/utils/v1/utils/dataroom/document`,
    data: requestPayload,
  });
  const data = await (await promise).data?.data;
  return data || null;
};

export const fetchDocumentLink = async (requestPayload: { path: string }): Promise<ISignedURL> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/utils/v1/utils/files/link`,
    data: requestPayload,
  });
  const data = await (await promise).data?.data;
  return data || null;
};

export const acceptClientTerms = async (): Promise<IUser> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/auth/v2/client/terms/accept`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};

export const acceptPlatformTerms = async (): Promise<IUser> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/auth/v2/client/tnc/accept`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};

export const getFileUploadLink = async (file: {
  filename: string;
  formData: any;
}): Promise<IUploadResponse> => {
  const promise = sharedDashboardApi({
    url: "/utils/v1/utils/files/create",
    method: "POST",
    data: { filename: file.filename },
  });
  const response = await (await promise).data.data;

  const uploadFile = axios({
    method: "put",
    url: `${response.url}`,
    data: file.formData,
    headers: { "Content-Type": `application/xml` },
  });


  console.log("🚀 ~ file: documents.ts:74 ~ uploadFile:", uploadFile);
  return response;
};
