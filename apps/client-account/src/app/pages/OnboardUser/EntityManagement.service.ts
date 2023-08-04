import { dashboardApi } from "../../services/APIService";
import { INewUser } from "./InvitedUsersTable/InvitedUsersTable.types";


export const getOnboardedUsers = async (): Promise<INewUser[]> => {
  const promise = dashboardApi({
    baseURL: "v1/onboarderUsers",
    method: "GET"
  });
  const data = await (await promise).data;
  return data || [];
};

export const setStatus = (user: { id: string, status: string }) => {
  if (!user.id || user?.id === "") return Promise.reject();
  return dashboardApi({
    baseURL: `v1/onboarderUsers/${user.id}`,
    method: "PUT",
    data: {
      status: user.status
    }
  });
};

export const onboardUser = (user: INewUser) => {
  return dashboardApi({
    baseURL: "v1/onboardUser",
    method: "POST",
    data: {
      user
    }
  });
};

