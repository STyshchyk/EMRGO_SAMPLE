import { authApi } from "../../services/APIService";
import { ILoginFormValues } from "./Login.types";

export const loginUser = (requestObject: ILoginFormValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: `/v2/client/login`,
  });
  return promise;
};
