import { IUserConfigData } from "@emrgo-frontend/types";

import { sharedSilverDashboardApi } from "./silver.instance";

const sharedDashboardApi = sharedSilverDashboardApi;
export const fetchUserProfileSilver = async (): Promise<IUserConfigData> => {
  const promise = sharedSilverDashboardApi({
    method: "get",
    url: `/auth/v2/profile`,
  });
  const data = await (await promise).data;
  return data || [];
};

export const logoutUserSilver = async () => {
  const promise = sharedDashboardApi({
    method: "post",
    url: `/auth/v2/logout`,
  });
  const data = await (await promise).data;
  return data || [];
};
