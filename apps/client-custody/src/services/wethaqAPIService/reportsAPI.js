import { baseAxiosInstance } from "./helpers";

const getCashAccounts = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/accounts/v1/accounts`,
    params: payload || null,
  });

const getCashTransactions = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/payments/v2/accounts/transactions?${payload.qs}`,
  });

const getCashBalances = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/reports/v2/reports/cashBalances?${payload.qs}`,
  });

const getSecuritiesAccounts = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/accounts/v1/securitiesAccounts`,
    params: payload || null,
  });

const getSecuritiesTransactions = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/reports/v2/reports/securitiesTransactions?${payload.qs}`,
  });

//
const getSecuritiesHoldings = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/reports/v2/reports/securitiesHoldings`,
    params: payload?.params,
  });

const getTradeDateSecuritiesHoldings = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/reports/v2/reports/securitiesHoldings/tradeDateHolding`,
    params: payload?.params,
  });

const getReferenceData = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/reports/v1/reports/referenceData`,
    params: payload || null,
  });

const getSafeAccounts = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/accounts/v1/safeKeepingAccounts`,
    params: payload || null,
  });

const reportsAPI = {
  getCashAccounts,
  getCashTransactions,
  getCashBalances,
  getSecuritiesAccounts,
  getSecuritiesTransactions,
  getSecuritiesHoldings,
  getTradeDateSecuritiesHoldings,
  getReferenceData,
  getSafeAccounts,
};

export default reportsAPI;
