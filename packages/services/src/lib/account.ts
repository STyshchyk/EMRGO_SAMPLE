import { IUserConfigData } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";

export const fetchUserProfile = async (): Promise<IUserConfigData> => {
  const promise = sharedDashboardApi({
    method: "get",
    url: `/auth/v2/profile`,
  });
  const data = await (await promise).data;
  return data || [];
};

export const logoutUser = async () => {
  const promise = sharedDashboardApi({
    method: "post",
    url: `/auth/v2/logout`,
  });
  const data = await (await promise).data;
  return data || [];
};

export const verifyEntityExists = (requestObject: { entityName : string }) => {
  const promise = sharedDashboardApi({
    method: "get",
    params: requestObject,
    url: `/auth/v2/client/entity/exists`,
  });
  return promise;
};

export const verifyEmailExists = (requestObject: { email: string, userType: string }) => {
  const promise = sharedDashboardApi({
    method: "get",
    params: {...requestObject, userType:requestObject.userType},
    url: `/auth/v2/email/exists`,
  });
  return promise;
};

export const enableAuthenticatorMFA = (requestObject: { code: string }) => {
  const promise = sharedDashboardApi({
    method: "post",
    data: requestObject,
    url: `/auth/v2/mfa/enable`,
  });
  return promise;
};

export const setupAuthenticatorMFA = () => {
  const promise = sharedDashboardApi({
    method: "post",
    url: `/auth/v2/mfa/setup`,
  });
  return promise;
};

export const verifyAuthenticatorMFA = (requestObject: { code: string }) => {
  const promise = sharedDashboardApi({
    method: "post",
    data: requestObject,
    url: `/auth/v2/mfa/verify`,
  });
  return promise;
};

export const requestResetAuthenticatorMFA = () => {
  const promise = sharedDashboardApi({
    method: "put",
    url: `/auth/v2/mfa/reset/request`,
  });
  return promise;
};

export const refreshToken = (role: string) => {
  return sharedDashboardApi({
    method: "POST",
    url: "/auth/v2/refreshTokens",
    data: { role },
    validateStatus: null,
  });
};
