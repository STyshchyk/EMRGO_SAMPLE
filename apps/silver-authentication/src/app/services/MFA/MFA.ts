import { authApi } from "../APIService";
import { IMFA } from "./MFA.types";


export const enableMFA = async (requestObject: { code: string }) => {
  const promise = authApi({
    method: "POST",
    data: { code: requestObject },
    url: `/auth/v2/mfa/enable`
  });
  const res = await (await promise);
  if (res.status >= 300) return Promise.reject();
  return res;
};

export const setupMFA = async (): Promise<IMFA> => {
  const promise = authApi({
    method: "POST",
    url: "auth/v2/mfa/setup",
    validateStatus: null

  });
  const res = await (await promise);
  if (res.status >= 300) return Promise.reject();
  return res.data || [];
};

export const verifyMFA = async (requestObject: { code: string }) => {
  const promise = authApi({
    method: "POST",
    data: requestObject,
    url: `/auth/v2/mfa/verify`
  });
  const res = await (await promise);
  if (res.status >= 300) return Promise.reject();
  return promise;
};

