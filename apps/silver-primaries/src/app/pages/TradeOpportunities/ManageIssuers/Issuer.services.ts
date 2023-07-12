import { IIssuer } from "@emrgo-frontend/types";

import { dashboardApi } from "../../../services/APIService";
import { IShownStatus } from "../TradeOpportunities.service";


export const postIssuer = (requestData: IIssuer) => {
  return dashboardApi({
    method: "POST",
    url: "v1/internal/issuer",
    data: requestData,
  });
};
export const getIssuers = async (): Promise<IIssuer[]> => {
  const req = dashboardApi({
    method: "GET",
    url: "v1/internal/issuers",
  });
  const data = await (await req).data.data;
  return data || [];
};
export const getIssuer = async (id: string): Promise<IIssuer[]> => {
  const req = dashboardApi({
    method: "GET",
    url: `/v1/internal/issuer/${id}`,
  });
  const data = await (await req).data.data;
  return data || [];
};

export const updateIssuer = (payload: IIssuer) => {
  return dashboardApi({
    method: "PUT",
    url: `/v1/internal/issuer/${payload.id}`,
    data: payload,
  });
};


export const shownIssuer = (payload: IShownStatus) => {
  return dashboardApi({
    method: "PATCH",
    url: `/v1/internal/issuer/${payload.id}/${payload.status}`
  });
};
