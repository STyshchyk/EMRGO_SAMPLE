import { IUser } from "@emrgo-frontend/types";

import { dashboardApi } from "../../services/APIService";

export const acceptClientTerms = async (): Promise<IUser> => {
  const promise = dashboardApi({
    method: "put",
    url: `/auth/v2/client/terms/accept`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};
