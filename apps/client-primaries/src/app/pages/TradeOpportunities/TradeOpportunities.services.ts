import { IBank, IOption } from "@emrgo-frontend/types";

import { dashboardApi } from "../../services/APIService";

export const fetchOpportunities = async (
  filterType: IOption | null,
  filterStatus: IOption | null
): Promise<IBank[]> => {
  //FIXME: update api path once data is available
  const promise = dashboardApi({
    method: "get",
    url: `opp/v1/external/opportunities`,
    params: {
      type: filterType?.value || "",
      status: filterStatus?.value || "",
    },
  });
  const data = await (await promise).data?.data;
  return data || [];
};
