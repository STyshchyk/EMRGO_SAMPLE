import { baseAxiosInstance } from "./helpers";

const fetchValues = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/auth/v2/profile/settings/query`,
    data: {
      "keys": [
        ...payload
      ]
    }
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
