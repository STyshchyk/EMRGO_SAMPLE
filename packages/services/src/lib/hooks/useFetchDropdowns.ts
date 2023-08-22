import { queryKeys } from "@emrgo-frontend/constants";
import { IDropdownsResponse } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

import { sharedDashboardApi } from "../instances";

interface IFetchDropdownsQueryParams {
  types: string[];
}

const QUERY_KEY = [queryKeys.miscelleneous.dropdowns.fetch];

const fetchDropdowns = async (params: IFetchDropdownsQueryParams): Promise<IDropdownsResponse> => {
  const { data } = await sharedDashboardApi({
    method: "get",
    url: `dropdown/v1/dropdown`,
    params: {
      types: JSON.stringify(params.types),
    },
  });
  return data;
};

export const useFetchDropdowns = (params: IFetchDropdownsQueryParams) => {
  return useQuery<IDropdownsResponse, Error>(QUERY_KEY, () => fetchDropdowns(params));
};
