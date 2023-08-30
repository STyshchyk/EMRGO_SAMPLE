import { baseAxiosInstance } from "./helpers";

const fetchTFATickets = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/support/v1/supportTicket`,
  });

const upload2faVerificationFile = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `/files/v1/files/upload/supportTicket/link`,
  });

const fetchTFAVerificationDocument = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload,
    url: `/files/v1/files/view`,
  });

const createTFATicket = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/support/v1/supportTicket`,
  });

const deleteTFATicket = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    data: payload,
    url: `/support/v1/supportTicket/${payload.supportTicketId}`,
  });

const approveTFATicket = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload,
    url: `/support/v1/supportTicket/${payload.supportTicketId}`,
  });

const supportAPI = {
  fetchTFATickets,
  upload2faVerificationFile,
  fetchTFAVerificationDocument,
  createTFATicket,
  deleteTFATicket,
  approveTFATicket,
};

export default supportAPI;
