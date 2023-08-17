import { baseAxiosInstance } from "./helpers";

export const fetchDocumentLink = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/files`,
    data: payload.params,
  });

export const fetchStaticFileLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/files/static/assets`,
    params: payload,
  });

export const readTableConfig = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/auth/v2/profile/settings`,
    params: payload,
  });

export const updateTableConfig = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/auth/v2/profile/settings`,
    data: payload,
  });

const miscellaneousAPI = {
  fetchDocumentLink,
  fetchStaticFileLink,
  readTableConfig,
  updateTableConfig,
};

export default miscellaneousAPI;
