import { IMFA } from "../../services";
import { authApi } from "../../services/APIService";
import { IUser } from "../store";
import { ILoginFormValues } from "./Login.types";

export const loginUser = async (requestObject: ILoginFormValues): Promise<IUser | IMFA> => {
  const promise = authApi({
    method: "POST",
    data: requestObject,
    url: "/v2/internal/login"
  });
  const data = await (await promise);
  //Set to onError react query status to handle error msg
  if (data.status >= 300) return Promise.reject(data);
  //Check if login is successful and contains user object
  const key = Object.keys(data.data)[0];
  if (key === "user") return data.data.user as IUser;
  else return data.data as IMFA || {};
  // Else return mfa credentials
};
export const logoutUser = () => {
  return authApi({
    method: "POST",
    url: "/v2/logout"
  });
};
