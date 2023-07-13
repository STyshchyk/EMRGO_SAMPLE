import { queryKeys } from "@emrgo-frontend/constants";
import { IUserResponse } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

import { sharedDashboardApi } from "../instances";

const QUERY_KEY = [queryKeys.account.profile.fetch];

const fetchUser = async (): Promise<IUserResponse> => {
  const { data } = await sharedDashboardApi({
    method: "get",
    url: `/v2/profile`,
  });
  return data;
};

export const useFetchUser = () => {
  return useQuery<IUserResponse, Error>(QUERY_KEY, () => fetchUser());
};