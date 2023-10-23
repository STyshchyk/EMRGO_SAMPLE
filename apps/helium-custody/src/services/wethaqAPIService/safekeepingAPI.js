import { baseAxiosInstance } from "./helpers";

const readAccounts = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/accounts/v1/safeKeepingAccounts`,
    params: payload || null,
  });

const createAccount = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/accounts/v1/safeKeepingAccounts`,
  });

const updateAccount = (payload) => {
  return baseAxiosInstance({
    method: "PATCH",
    data: payload.requestPayload,
    url: `/accounts/v1/safeKeepingAccounts/${payload.accountId}`,
  });
};

const safekeepingAPI = {
  readAccounts,
  createAccount,
  updateAccount,
};

export default safekeepingAPI;
