import { baseAxiosInstance } from "./helpers";

const fetchValues = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/auth/v2/profile/settings`,
    params: {
      keys: JSON.stringify(payload.keys),
    },
  });

const postValues = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/auth/v2/profile/settings`,
    data: payload,
  });

const formManageAPI = {
  fetchValues,
  postValues,
};

export default formManageAPI;
