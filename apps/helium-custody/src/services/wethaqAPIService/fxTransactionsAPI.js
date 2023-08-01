import { baseAxiosInstance } from "./helpers";

const getFxTransactions = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/fxTransactions`,
    params: payload,
  });

const addFxTransaction = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/v1/fxTransactions`,
  });

const processFxTransaction = (data) =>
  baseAxiosInstance({
    method: "PUT",
    data: data.requestPayload,
    url: `/v1/fxTransactions/${data.transactionId}`,
  });

const fxTransactionsAPI = {
  getFxTransactions,
  addFxTransaction,
  processFxTransaction,
};

export default fxTransactionsAPI;
