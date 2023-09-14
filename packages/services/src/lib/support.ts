import { ITFASupportTicketData } from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";

export const createSupportTicket = async (requestPayload: ITFASupportTicketData) => {
  const promise = sharedDashboardApi({
    method: "POST",
    url: `/support/v1/supportTicket`,
    data: requestPayload,
  });
  const data = await (await promise).data;
  return data || [];
};
