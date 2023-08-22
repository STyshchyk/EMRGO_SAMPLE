import { baseAxiosInstance } from "./helpers";

export const fetchBulletins = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/homepage`,
  });

const uploadBulletinFile = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `/files//v1/files/upload/link`,
  });

const createBulletin = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/v1/homepage`,
  });

const deleteBulletin = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    data: payload,
    url: `/v1/homepage/${payload.bulletinId}`,
  });

const fetchBulletinDocument = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload,
    url: `/files//v1/files/view`,
  });

const updateBulletin = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload,
    url: `/v1/homepage/${payload.bulletinId}`,
  });

const bulletinAPI = {
  fetchBulletins,
  uploadBulletinFile,
  createBulletin,
  deleteBulletin,
  fetchBulletinDocument,
  updateBulletin,
};

export default bulletinAPI;
