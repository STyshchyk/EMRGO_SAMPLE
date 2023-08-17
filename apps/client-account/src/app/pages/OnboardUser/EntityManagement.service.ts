import { dashboardApi } from "../../services/APIService";
import { IMakeOrRevokeAdminRequestPayload,INewUser } from "./EntityManagement.types";


export const getOnboardedUsers = async (): Promise<INewUser[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: "/auth/v2/users",
  });
  const res = await (await promise).data.users;
  return res || [];
};

export const getRoles = async () => {
  const promise = dashboardApi({
    url: "/auth/v2/client/roles",
    method: "GET"
  });
  const res = await (await promise).data.roles;
  return res || []
};

export const inviteUser = (user: INewUser) => {
  const promise = dashboardApi({
    url: "/auth/v2/client/users",
    method: "POST",
    data: { ...user }
  });

  return promise
};

export const cancelInvitation = (id: string) => {
  if (!id || id === "") return Promise.reject();
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/invite/cancel`,
  });
};

export const resendInvite = (id: string) => {
  if (!id || id === "") return Promise.reject();
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/invite/resend`,
  });
};

export const archiveUser = (id: string) => {
  if (!id || id === "") return Promise.reject();
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/archive`,
  });
};


export const makeOrRevokeAdmin = (requestPayload : IMakeOrRevokeAdminRequestPayload) => {
  const { id, isAdmin } = requestPayload
  if (!id || id === "") return Promise.reject();
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/admin`,
    data: { isAdmin }
  });
};






