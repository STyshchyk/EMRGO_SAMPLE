import { authApi } from "../../services/APIService";
import { IChangeEmailVerificationFormProps } from "./ChangeEmailVerification.types";

export const verifyEmailChange = (requestObject: IChangeEmailVerificationFormProps) => {
  const promise = authApi({
    method: "put",
    data: requestObject,
    url: `/v2/profile/change-email`,
  });
  return promise;
};
