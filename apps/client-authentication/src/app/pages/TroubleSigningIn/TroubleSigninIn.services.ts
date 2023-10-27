import { authApi } from "../../services/APIService";
import {ITFASupportTicketData} from './TroubleSigningIn.types'

export const createSupportTicket = async (requestPayload: ITFASupportTicketData) => {
  const promise = authApi({
    method: "POST",
    url: `/support/v1/supportTicket`,
    data: requestPayload,
  });
  const data = await (await promise).data;
  return data || [];
};

export const verifyEmailExists = (requestObject: { email: string }) => {
    const promise = authApi({
      method: "get",
      params: {...requestObject,userType:'client'},
      url: `/auth/v2/email/exists`,
    });
    return promise;
};
