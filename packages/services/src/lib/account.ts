import { IUser } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";

export const fetchUserProfile = async (): Promise<IUser> => {
  const promise = sharedDashboardApi({
    method: "get",
    url: `/v2/profile`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};

export const logoutUser = async () => {
  const promise = sharedDashboardApi({
    method: "post",
    url: `/v2/logout`,
  });
  const data = await (await promise).data;
  return data || [];
};

export const verifyEmailExists = (requestObject: { email: string }) => {
  const promise = sharedDashboardApi({
    method: "get",
    params: requestObject,
    url: `/v2/client/email/exists`,
  });
  return promise;
};

export const enableAuthenticatorMFA = (requestObject: { code: string }) => {
  const promise = sharedDashboardApi({
    method: "post",
    data: requestObject,
    url: `/v2/mfa/enable`,
  });
  return promise;
};

export const setupAuthenticatorMFA = () => {
  const promise = sharedDashboardApi({
    method: "post",
    url: `/v2/mfa/setup`,
  });
  return promise;
};

export const verifyAuthenticatorMFA = (requestObject: { code: string }) => {
  const promise = sharedDashboardApi({
    method: "post",
    data: requestObject,
    url: `/v2/mfa/verify`,
  });
  return promise;
};

export const requestResetAuthenticatorMFA = () => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/v2/mfa/reset/request`,
  });
  return promise;
};
