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
    url: `/auth/v2/internal/entities`,
  });

const getEmrgoOwners = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/auth/v2/internal/entities/emrgo`,
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
  getEmrgoOwners,
  transferMoney,
  transferMoneyInternal,
  getExternalPaymentsAuditDataById,
};

export default billingAndPaymentsAPI;
