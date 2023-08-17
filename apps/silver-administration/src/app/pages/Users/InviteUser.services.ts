import { dashboardApi } from "../../services/APIService";
import { IInviteUserValues } from "./InviteUserModal/InviteUser.types";

export const inviteUser = (requestObject: IInviteUserValues) => {
  return dashboardApi({
    method: "POST",
    data: requestObject,
    url: "/auth/v2/internal/users",
  });
};

export const cancelInvitation = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/invite/cancel`,
  });
};

export const removeUser = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/archive`,
  });
};

export const reset2FA = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/internal/users/${id}/mfa/reset`,
  });
};

export const resendInfo = (id: string) => {
  return dashboardApi({
    method: "PUT",
    url: `/auth/v2/users/${id}/invite/resend`,
  });
};
