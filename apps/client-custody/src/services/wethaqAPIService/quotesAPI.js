import { baseAxiosInstance } from "./helpers";

export const createQuote = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/bulletinBoard`,
    data: payload,
  });

export const readQuote = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/bulletinBoard`,
    data: payload,
  });

export const updateQuote = (payload) => {
  const updatedPayload = payload;
  const { quoteId } = updatedPayload;
  delete updatedPayload.quoteId;
  return baseAxiosInstance({
    method: "PATCH",
    url: `/v1/bulletinBoard/${quoteId}`,
    data: payload,
  });
};

export const deleteQuote = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    url: `/v1/bulletinBoard/${payload.quoteId}`,
  });

const quotesAPI = {
  createQuote,
  readQuote,
  updateQuote,
  deleteQuote,
};

export default quotesAPI;
