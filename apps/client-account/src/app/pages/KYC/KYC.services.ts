import { dashboardApi } from "../../services/APIService";
import {
  ICreateFormSessionRequestPayload,
  ICreateFormSessionResponsePayload,
  IKYCResponse,
} from "./KYC.types";

export const fetchKYCForms = async (): Promise<IKYCResponse> => {
  const promise = dashboardApi({
    method: "get",
    url: `v2/client/kyc/forms`,
    params: {
      kycType: "entity",
    },
  });
  const data = await (await promise).data;
  return data || [];
};

export const createFormSession = async (
  requestPayload: ICreateFormSessionRequestPayload
): Promise<ICreateFormSessionResponsePayload> => {
  const promise = dashboardApi({
    method: "post",
    url: `v2/client/kyc/forms`,
    data: requestPayload,
  });
  const data = await (await promise).data;
  return data || [];
};
