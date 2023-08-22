import { ICurrency, ISellside, IShownStatus } from "@emrgo-frontend/types";

import { sharedSilverDashboardApi } from "./silver.instance";

const dashboardApi = sharedSilverDashboardApi;
export const postSellside = (requestData: ISellside) => {
  return dashboardApi({
    method: "POST",
    url: "v1/internal/sellside",
    data: requestData,
  });
};

export const doGetAllSellside = async (): Promise<ISellside[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: "v1/internal/sellsides",
  });
  const data = await (await promise).data.data;
  return data || [];
};
export const updateSellside = (requestData: ISellside) => {
  return dashboardApi({
    method: "PUT",
    url: `v1/internal/sellside/${requestData.id}`,
    data: requestData,
  });
};

export const doGetSellside = (requestData: ISellside) => {
  return dashboardApi({
    method: "GET",
    url: `v1/internal/sellside/${requestData.id}`,
  });
};

export const doGetCurrencies = async (types: string): Promise<ICurrency[]> => {
  const response = dashboardApi({
    method: "GET",
    url: `dropdown/v1/dropdown`,
    params: {
      types: types,
    },
  });

  const data = await (await response).data;
  const key = Object.keys(data)[0];
  return data[key] || [];
};

export const shownSellside = (payload: IShownStatus) => {
  return dashboardApi({
    method: "PATCH",
    url: `/v1/internal/sellside/${payload.id}/${payload.status}`,
  });
};
