import { dashboardApi } from "../../../services/APIService";
import { IIssuanceDetails } from "./Issuance.types";

export const fetchIssuance = async (issuanceId: string): Promise<IIssuanceDetails> => {
  const promise = dashboardApi({
    method: "get",
    url: `/v1/external/opportunity/${issuanceId}`,
  });
  const data = await (await promise).data?.data;
  return data || [];
};
