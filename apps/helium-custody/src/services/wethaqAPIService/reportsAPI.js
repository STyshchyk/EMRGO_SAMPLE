import axios from "axios";

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
    url: `/payments/v1/accounts/transactions?${payload.qs}`,
  });

const getCashBalances = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/reports/v2/reports/cashBalances`,
    params: payload?.params || null,
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
    url: `/reports/v2/reports/securitiesTransactions`,
    params: payload?.params,
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

const reportsAPI = {
  getCashAccounts,
  getCashTransactions,
  getCashBalances,
  getSecuritiesAccounts,
  getSecuritiesTransactions,
  getSecuritiesHoldings,
  getTradeDateSecuritiesHoldings,
  getReferenceData,
};

export default reportsAPI;
