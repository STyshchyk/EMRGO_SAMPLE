import { IUser } from "@emrgo-frontend/types";

import { authApi } from "../../services/APIService";
import { ILoginFormValues } from "./Login.types";

export const loginUser = async (requestObject: ILoginFormValues): Promise<IUser> => {
  const promise = authApi({
    method: "post",
    data: requestObject,
    url: "/auth/v2/internal/login"
  });
  const res = await (await promise);

  if (res.status >= 300) return Promise.reject(res);
  return res.data;
};
