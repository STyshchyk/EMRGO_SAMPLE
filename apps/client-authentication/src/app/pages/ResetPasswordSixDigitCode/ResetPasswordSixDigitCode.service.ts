import { authApi } from "../../services/APIService";
import { IResetPasswordSixDigitCodeValues } from "./ResetPasswordSixDigitCode.types";

export const verifyOTP = (requestObject: IResetPasswordSixDigitCodeValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/v2/client/forgot-password/verify`,
  });
  return promise;
};
