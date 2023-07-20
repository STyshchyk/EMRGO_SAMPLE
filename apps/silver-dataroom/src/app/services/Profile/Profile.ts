import { IUser } from "../../pages/Authentication/store";
import { dashboardApi } from "../APIService";
import { ISettings } from "./Profile.types";

export const getProfile = async (): Promise<IUser> => {
  const promise = dashboardApi({
    url: "/profile",
    method: "GET",
  });
  const data = await (await promise).data;
  return data || {};
};

export const getProfileSettings = async (): Promise<ISettings> => {
  const promise = dashboardApi({
    url: "/profile/settings",
    method: "GET",
  });
  const data = await (await promise).data;
  return data || {};
};

export const setProfileSettings = (payload: ISettings) => {
  return dashboardApi({
    url: "/profile/settings",
    method: "POST",
    data: payload,
  });
};

export const acceptClientTerms = async (): Promise<IUser> => {
  const promise = dashboardApi({
    method: "put",
    url: `/v2/internal/terms/accept`,
  });
  const data = await (await promise).data?.user;
  return data || [];
};
