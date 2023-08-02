import { baseAxiosInstance } from "./helpers";

const fetchValues = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/users/profile/settings/tables-manage`,
    params: {
      keys: JSON.stringify(payload.keys),
    },
  });

const postValues = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: `/v1/users/profile/settings/tables-manage`,
    data: payload,
  });

const formManageAPI = {
  fetchValues,
  postValues,
};

export default formManageAPI;
