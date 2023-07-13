import { sharedSilverDashboardApi } from "./silver.instance";


// TODO : add return type
export const getTradeManagement = async (part: "watchlist" | "pending" | "executed"): Promise<any> => {
  const promise = sharedSilverDashboardApi({
    method: "GET",
    url: `/v1/external/trademanagement/${part}`
  });
  const data = await (await promise).data;
  return data || [];
};
