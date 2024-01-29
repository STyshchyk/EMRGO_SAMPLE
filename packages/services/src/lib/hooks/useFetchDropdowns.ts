import { queryKeys } from "@emrgo-frontend/constants";
import { IDropdownsResponse } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

import { sharedDashboardApi } from "../instances";

interface IFetchDropdownsQueryParams {
  types: string[];
}

const QUERY_KEY = [queryKeys.miscelleneous.dropdowns.fetch];

const fetchDropdowns = async (
  params: string | IFetchDropdownsQueryParams
): Promise<IDropdownsResponse> => {
  const { data } = await sharedDashboardApi({
    method: "get",
    url: `dropdown/v1/dropdown`,
    params: {
      types: params?.type ? JSON.stringify(params.types) : params,
    },
  });
  return data;
};

export const useFetchDropdowns = (params: IFetchDropdownsQueryParams) => {
  return useQuery<IDropdownsResponse, Error>({
    queryKey: QUERY_KEY,
    queryFn: () => fetchDropdowns(params),
    staleTime: Infinity,
  });
};
