import { baseAxiosInstance } from "./helpers";

const sendSubscription = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.requestPayload,
    url: `v1/subscription/sukuk/${payload.sukukId}`,
  });

const getSubscriptions = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `v1/subscription/sukuk/${payload.sukukId}`,
  });

const confirmSubscription = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `v1/subscription/sukuk/${payload.sukukId}/confirm`,
  });

const finaliseSubscription = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `v1/subscription/sukuk/${payload.sukukId}/finalise`,
  });

const subscriptionsAPI = {
  sendSubscription,
  getSubscriptions,
  confirmSubscription,
  finaliseSubscription,
};

export default subscriptionsAPI;
