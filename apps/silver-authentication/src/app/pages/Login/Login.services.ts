import { authApi } from "../../services/APIService";
import { ILoginFormValues } from "./Login.types";

export const loginUser = (requestObject: ILoginFormValues) => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: "/auth/v2/internal/login",
    validateStatus: function (status) {
      return status < 300;
    },
  });
  return promise;
};
