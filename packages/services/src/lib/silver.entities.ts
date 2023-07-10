import {IEntity} from "@emrgo-frontend/types";

import {  sharedSilverDashboardApi} from "./silver.instance";

export const getEntities = async (): Promise<IEntity[]> => {
  const promise = sharedSilverDashboardApi({
    method: "GET",
    url: "/v2/internal/entities"
  });
  const data = await (await promise).data.entities;
  return data || [];
};
