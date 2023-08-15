import {baseAxiosInstance} from "../wethaqAPIService/helpers";

export const createInvestmentFormSession = async (
  requestPayload: any
) => {
  const promise = baseAxiosInstance({
    method: "post",
    url: `v2/client/kyc/forms`,
    data: requestPayload
  });
  const data = await (await promise).data;
  return data || [];
};

export const submitInvestorProfileForms = async () => {
  const promise = baseAxiosInstance({
    method: "put",
    url: `v2/client/kyc/submit`,
    params: {
      kycType: "entityCustody"
    }
  });
  const data = await (await promise).data;
  return data || [];
};
export const fetchKYCForms = async () => {
  const promise = baseAxiosInstance({
    method: "get",
    url: `v2/client/kyc/forms`,
    params: {
      kycType: "entityCustody"
    }
  });
  const data = await (await promise).data;
  return data || [];
};
