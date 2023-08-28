import { baseAxiosInstance } from "./helpers";

export const fetchDocumentLink = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/files/v1/files`,
    data: payload.params
  });

export const fetchStaticFileLink = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/files/static/assets`,
    params: payload
  });

export const readTableConfig = async (payload) => {
  const req = baseAxiosInstance({
    method: "POST",
    url: `/auth/v2/profile/settings/query`,
    data: payload
  });
  const res = await (await req)
  return res;
};

export const updateTableConfig = (payload) =>{
  return baseAxiosInstance({
    method: "POST",
    url: `/auth/v2/profile/settings`,
    data: payload
  })}

const miscellaneousAPI = {
  fetchDocumentLink,
  fetchStaticFileLink,
  readTableConfig,
  updateTableConfig
};

export default miscellaneousAPI;
