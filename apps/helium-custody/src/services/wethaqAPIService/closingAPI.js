import { baseAxiosInstance } from "./helpers";

const fetchClosing = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/closing/${payload.sukukId}`,
  });

const initializeClosing = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `v1/closing/${payload.sukukId}/postSigning`,
    data: payload,
  });

const requestClosing = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `v1/closing/${payload.sukukId}`,
  });

const confirmClosing = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `v1/closing/${payload.sukukId}`,
  });

const completeClosing = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `v1/closing/${payload.sukukId}/complete`,
  });

const closingAPI = {
  fetchClosing,
  requestClosing,
  confirmClosing,
  initializeClosing,
  completeClosing,
};

export default closingAPI;
