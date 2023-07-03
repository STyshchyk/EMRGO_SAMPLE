import { IUser } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";

export const toggleWatchlistItem = async (requestPayload: {
  action: string;
  opportunityId: string;
}): Promise<IUser> => {
  const promise = sharedDashboardApi({
    method: "post",
    url: `/v1/external/watchlist`,
    data: requestPayload,
  });
  const data = await (await promise).data?.user;
  return data || [];
};
