import { baseAxiosInstance } from "./helpers";

export const download = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/files/v1/files`,
    data: payload,
  });

export const upload = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/files/v1/files`,
    data: payload,
  });

const fileAPI = {
  download,
  upload,
};

export default fileAPI;
