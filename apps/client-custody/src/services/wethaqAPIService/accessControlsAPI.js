import { baseAxiosInstance } from "./helpers";

const getListOfValidAccessControls = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/accessControls`,
    params: {
      type: payload.params.type,
    },
  });

const accountsAPI = {
  getListOfValidAccessControls,
};

export default accountsAPI;
