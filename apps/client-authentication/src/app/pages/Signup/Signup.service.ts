import { authApi } from "../../services/APIService";
import {
  ISignupEntityExistsValues,
  ISignupFormValues,
} from "./Signup.types";

export const verifyEntityExists = (requestObject: ISignupEntityExistsValues) => {
  const promise = authApi({
    method: "get",
    params: requestObject,
    url: `/v2/client/entity/exists`,
  });
  return promise;
};

export const registerEntity = (requestObject: ISignupFormValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/v2/client/entity/register`,
  });
  return promise;
};
