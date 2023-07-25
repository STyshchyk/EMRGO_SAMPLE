import { IMFA } from "../../services";
import { authApi } from "../../services/APIService";

export interface ISetPassword {
  password: string;
  token: string;
}

export const createPassword = async (payload: ISetPassword): Promise<IMFA> => {
  const promise = authApi({
    method: "POST",
    url: "/v2/internal/users/set-password",
    data: payload,
  });
  const data = await await promise;
  if (data.status >= 300) return Promise.reject(data);
  return data.data || {};
};
