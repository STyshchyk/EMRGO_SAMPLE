import { IDocument } from "@emrgo-frontend/types";

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
