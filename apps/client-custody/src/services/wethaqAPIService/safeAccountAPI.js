import { baseAxiosInstance } from "./helpers";

const getSafeAccountApi = async (payload) => {
  const promise = baseAxiosInstance({
    method: "GET",
    url: "/accounts/v1/safeKeepingAccounts",
    params: payload,
  });
  const res = await (await promise).data.data;
  return res || [];
};
const safeAccountApi = {
  getSafeAccountApi,
};
export default safeAccountApi;
