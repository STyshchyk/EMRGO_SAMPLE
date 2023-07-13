import { dashboardApi} from "../services/APIService";
import { IUserNew } from "./Users/User.types";

export const doGetRoles = () => {
  return dashboardApi({
    method: "GET",
    url: "v2/internal/roles",
  });
};
export const refreshToken = () => {
  return dashboardApi({
    method: "POST",
    url: "v2/refreshTokens",
    //Skip running auth refresh for this particular API call
    validateStatus: null,
  });
};
export const doGetInvitedUsers = async (): Promise<IUserNew[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: "v2/internal/users",
  });
  const res = await (await promise).data.users;
  return res || [];
};
