import { IFetchProfileSettings, IPostProfileSettings } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";

export const fetchProfileSettings = async (payload: IFetchProfileSettings): Promise<any> => {
  if (!payload) return Promise.reject();
  const promise = sharedDashboardApi({
    method: "POST",
    url: `/auth/v2/profile/settings/query`,
    data: payload,
  });
  const res = await (await promise).data.settings;
  return res ?? [];
};

export const postProfileSettings = (payload: IPostProfileSettings) => {
  return sharedDashboardApi({
    method: "POST",
    url: `/auth/v2/profile/settings`,
    data: payload,
  });
};
