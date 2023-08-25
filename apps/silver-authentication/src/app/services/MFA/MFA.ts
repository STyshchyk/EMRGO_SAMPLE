import { authApi } from "../APIService";
import { IMFA } from "./MFA.types";

export const enableMFA = (code: string) => {
  return authApi({
    method: "POST",
    url: "auth/v2/mfa/enable",
    validateStatus: null,
    data: {
      code,
    },
  });
};

export const setupMFA = async (): Promise<IMFA> => {
  const promies = authApi({
    method: "POST",
    url: "auth/v2/mfa/setup",
    validateStatus: null,
  });
  const res = await (await promies).data;
  return res || [];
};

export const verifyMFA = (code: string) => {
  return authApi({
    method: "POST",
    url: "auth/v2/mfa/verify",
    validateStatus: null,
    data: {
      code,
    },
  });
};
