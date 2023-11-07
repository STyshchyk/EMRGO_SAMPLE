import { authApi } from "../../services/APIService";
import { IResetPasswordSixDigitCodeValues } from "./ResetPasswordSixDigitCode.types";

export const verifyOTP = (requestObject: IResetPasswordSixDigitCodeValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/auth/v2/client/forgot-password/verify`,
  });
  return promise;
};

export const verifyOTPInternal = (requestObject: IResetPasswordSixDigitCodeValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/auth/v2/client/forgot-password/verify`,
  });
  return promise;
};
