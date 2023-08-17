import { authApi } from "../../services/APIService";
import { IResetPasswordOptionsPhoneRequest } from "./ResetPasswordOptions.types";

export const resetPasswordWithPhone = (requestObject: IResetPasswordOptionsPhoneRequest) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/auth/v2/client/forgot-password/phone/request`,
  });
  return promise;
};
