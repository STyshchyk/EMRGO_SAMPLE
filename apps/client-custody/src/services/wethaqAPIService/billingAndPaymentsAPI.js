import { baseAxiosInstance } from "./helpers";

const getTransactions = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/payments/v1/accounts/transactions?${payload.qs}`,
  });

const getAccounts = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/accounts/v1/accounts`,
    params: payload || null,
  });

const getOwners = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/entities`,
  });

const transferMoney = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload,
    url: `/payments/v1/accounts/transfer`,
  });

const transferMoneyInternal = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload?.requestPayload,
    url: `/payments/v1/accounts/transfer/internal`,
  });

const getExternalPaymentsAuditDataById = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/payments/v1/accounts/payments/outgoing/instruction/audit/${payload.externalPaymentId}`,
  });

const billingAndPaymentsAPI = {
  getTransactions,
  getAccounts,
  getOwners,
  transferMoney,
  transferMoneyInternal,
  getExternalPaymentsAuditDataById,
};

export default billingAndPaymentsAPI;
