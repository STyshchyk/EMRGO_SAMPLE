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
    url: `/v1/users/profile/settings/tables-manage`,
    params: payload,
  });

export const updateTableConfig = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/users/profile/settings/tables-manage`,
    data: payload,
  });

const miscellaneousAPI = {
  fetchDocumentLink,
  fetchStaticFileLink,
  readTableConfig,
  updateTableConfig,
};

export default miscellaneousAPI;
