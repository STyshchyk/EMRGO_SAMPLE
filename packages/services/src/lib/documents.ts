import { IDocument, ISignedURL, IUser } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";

export const fetchPlatformDocument = async (params: {
  documentType: string;
}): Promise<IDocument> => {
  const promise = sharedDashboardApi({
    method: "get",
    url: `/v2/platform/documents`,
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
    url: `/v1/utils/dataroom/document`,
    data: requestPayload,
  });
  const data = await (await promise).data?.data;
  return data || null;
};

export const fetchDocumentLink = async (requestPayload: { path: string }): Promise<ISignedURL> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/v1/utils/files/link`,
    data: requestPayload,
  });
  const data = await (await promise).data?.data;
  return data || null;
};

export const acceptClientTerms = async (): Promise<IUser> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/v2/client/terms/accept`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};

export const acceptPlatformTerms = async (): Promise<IUser> => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/v2/client/tnc/accept`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};
