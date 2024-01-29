import { queryKeys } from "@emrgo-frontend/constants";
import { IUser } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

import { sharedDashboardApi } from "../instances";

const QUERY_KEY = [queryKeys.account.profile.fetch];

const fetchUser = async (): Promise<IUser> => {
  const { data } = await sharedDashboardApi({
    method: "get",
    url: `/auth/v2/profile`,
  });
  return data;
};

export const useFetchUser = () => {
  return useQuery<IUser, Error>({
    queryKey: QUERY_KEY,
    queryFn: fetchUser,
    staleTime: Infinity,
  });
};
