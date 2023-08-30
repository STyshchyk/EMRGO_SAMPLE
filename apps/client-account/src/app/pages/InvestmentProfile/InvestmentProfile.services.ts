import { dashboardApi } from "../../services/APIService";
import {
  ICreateFormSessionRequestPayload,
  ICreateFormSessionResponsePayload,
  IInvestProfileResponse,
} from "./InvestmentProfile.types";

export const fetchInvestorProfileForms = async (): Promise<IInvestProfileResponse> => {
  const promise = dashboardApi({
    method: "get",
    url: `/auth/v2/client/kyc/forms`,
    params: {
      kycType: "user",
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
    url: `/auth/v2/client/kyc/forms`,
    data: requestPayload,
  });
  const data = await (await promise).data;
  return data || [];
};

export const submitInvestorProfileForms = async (): Promise<IInvestProfileResponse> => {
  const promise = dashboardApi({
    method: "put",
    url: `/auth/v2/client/kyc/submit`,
    params: {
      kycType: "user",
    },
  });
  const data = await (await promise).data;
  return data || [];
};

export const submitKYCForms = async (): Promise<IInvestProfileResponse> => {
  const promise = dashboardApi({
    method: "put",
    url: `/auth/v2/client/kyc/submit`,
    params: {
      kycType: "entity",
    },
  });
  const data = await (await promise).data;
  return data || [];
};
