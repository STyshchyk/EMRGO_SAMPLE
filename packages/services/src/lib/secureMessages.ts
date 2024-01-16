import { IUserConfigData } from "@emrgo-frontend/types";

import { sharedSilverDashboardApi } from "./silver.instance";

const sharedDashboardApi = sharedSilverDashboardApi;
export const fetchInternalMessages = async (): Promise<IUserConfigData> => {
  const promise = sharedDashboardApi({
    method: "get",
    url: `/messaging/v1/groups`,
  });
  const data = await (await promise).data;
  return data || [];
};
