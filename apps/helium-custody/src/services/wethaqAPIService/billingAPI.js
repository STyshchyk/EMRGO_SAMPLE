import { baseAxiosInstance } from "./helpers";

export const fetchRateCards = () =>
  baseAxiosInstance({
    method: "GET",
    url: `billing/v6/ratecard`,
  });

export const fetchRateCard = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `billing/v6/ratecard/${payload.clientRateCardId}`,
  });

export const createRateCard = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `billing/v6/ratecard`,
  });

export const updateRateCard = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.requestPayload,
    url: `billing/v6/ratecard/${payload.clientRateCardId}`,
  });

export const approveRateCard = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.requestPayload,
    url: `billing/v6/ratecard/${payload.clientRateCardId}/approve`,
  });

// Invoices

export const fetchInvoices = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `billing/v6/invoices`,
    params: payload.params,
  });

export const fetchInvoice = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `billing/v6/invoices/${payload.invoiceId}`,
  });

export const calculateInvoice = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.requestPayload,
    url: `billing/v6/invoice/${payload.invoiceId}/calculate`,
  });

export const updateInvoice = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.requestPayload,
    url: `billing/v6/invoice/${payload.invoiceId}`,
  });

export const approveInvoice = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.requestPayload,
    url: `billing/v6/invoice/${payload.invoiceId}/approve`,
  });

const bulletinAPI = {
  fetchRateCards,
  fetchRateCard,
  createRateCard,
  updateRateCard,
  approveRateCard,
  // Invoice
  fetchInvoices,
  fetchInvoice,
  calculateInvoice,
  updateInvoice,
  approveInvoice,
};

export default bulletinAPI;
