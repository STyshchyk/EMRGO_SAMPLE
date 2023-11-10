import { authApi } from "../../services/APIService";

export const resendEmail = (email: string) => {
  return authApi({
    method: "PUT",
    url: `/auth/v2/users/${email}/invite/resend/public`,
  });
};
