import axios from 'axios';
import { baseAxiosInstance } from './helpers';

const getCashAccounts = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts`,
    params: payload || null,
  });

const getCashTransactions = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/transactions?${payload.qs}`,
  });

const getCashBalances = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/reports/cashBalances?${payload.qs}`,
  });

const getSecuritiesAccounts = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/securitiesAccounts`,
    params: payload || null,
  });

const getSecuritiesTransactions = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/reports/securitiesTransactions?${payload.qs}`,
  });

//
const getSecuritiesHoldings = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/reports/securitiesHoldings`,
    params: payload?.params,
  });

const getTradeDateSecuritiesHoldings = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/reports/securitiesHoldings/tradeDateHolding`,
    params: payload?.params,
  });

const getReferenceData = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/reports/referenceData`,
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
