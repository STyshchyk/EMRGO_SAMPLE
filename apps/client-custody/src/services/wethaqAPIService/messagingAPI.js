import { baseAxiosInstance } from "./helpers";

export const fetchMessagesForLA = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/messaging/${payload.id}`,
    data: payload,
  });

export const submitMessage = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/messaging/${payload.roomID}/send`,
    data: payload,
  });

const messagingAPI = {
  fetchMessagesForLA,
  submitMessage,
};

export default messagingAPI;
