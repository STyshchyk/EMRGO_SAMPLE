import { baseAxiosInstance } from "./helpers";

const fetchValues = (payload) =>{
  return baseAxiosInstance({
    method: "POST",
    url: `/auth/v2/profile/settings/query`,
    data: { keys: payload?.keys }
  });
}


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
