import { dashboardApi } from "../APIService";
import { docTypes, IPlatformDocument } from "./Documents.types";

export interface IDocument {
  documentType: string;
  id: string;
  path: string;
}

export const getDocument = async (docType_: docTypes): Promise<IDocument> => {
  const promise = dashboardApi({
    url: "/auth/v2/platform/documents",
    method: "GET",
    params: {
      documentType: `${docType_}`,
    },
  });
  const response = await (await promise)?.data.data;
  return response || {};
};

export const getPlatformDocument = async (doc: {
  documentType: docTypes;
}): Promise<IPlatformDocument> => {
  const promise = dashboardApi({
    method: "PUT",
    url: `v1/utils/dataroom/document`,
    data: {
      documentType: "tnc",
    },
  });
  const res = await (await promise).data.data;
  return res || {};
};

export const viewFile = async (path: string): Promise<{ url: string }> => {
  const promise = dashboardApi({
    method: "PUT",
    url: `/v1/utils/files/link`,
    data: {
      path,
    },
  });
  const response = await (await promise).data.data;
  return response || [];
};
