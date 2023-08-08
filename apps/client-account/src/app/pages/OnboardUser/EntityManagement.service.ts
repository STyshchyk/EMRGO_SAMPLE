import { dashboardApi } from "../../services/APIService";
import { INewUser,IOnboardUserPayload } from "./EntityManagement.types";


export const getOnboardedUsers = async (): Promise<INewUser[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: "v2/users",
  });
  const res = await (await promise).data.users;
  return res || [];
};

export const getRoles = async () => {
  const promise = dashboardApi({
    url: "v2/client/roles",
    method: "GET"
  });
  const res = await (await promise).data.roles;
  return res || []
};

export const onboardUser = (user: IOnboardUserPayload) => {
  const promise = dashboardApi({
    url: "v2/client/users",
    method: "POST",
    data: { ...user }
  });

  return promise
};

export const cancelInvitation = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `v2/users/${id}/invite/cancel`,
  });
};

export const resendInvite = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `/v2/users/${id}/invite/resend`,
  });
};

export const archiveUser = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `/v2/users/${id}/archive`,
  });
};


export const setStatus = (user: { id: string, status: string }) => {
  if (!user.id || user?.id === "") return Promise.reject();
  return dashboardApi({
    url: `v1/onboarderUsers/${user.id}`,
    method: "PUT",
    data: {
      status: user.status
    }
  });
};

