import { authApi } from "../APIService";
import { IMFA } from "./MFA.types";



export const enableMFA = (requestObject: { code: string }) => {
  const promise = authApi({
    method: "POST",
    data: requestObject,
    url: `/auth/v2/mfa/enable`,
  });
  return promise;
};

export const setupMFA = async (): Promise<IMFA> => {
  const promise = authApi({
    method: "POST",
    url: "v2/mfa/setup",
    validateStatus: null

  });
  const res = await (await promise).data;
  return res || [];
};

export const verifyMFA = (requestObject: { code: string }) => {
  const promise = authApi({
    method: "POST",
    data: requestObject,
    url: `/auth/v2/mfa/enable`,
  });
  return promise;
};

