import { authApi } from "../../services/APIService";
import { ICreatePasswordFormValues } from "./CreatePassword.types";

export const createPassword = (requestObject: ICreatePasswordFormValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/auth/v2/client/entity/register/set-password`,
  });
  return promise;
};
