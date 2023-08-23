import { baseAxiosInstance } from "./helpers";

const getDropDownValues = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/dropdown/v1/dropdown`,
    params: {
      types: JSON.stringify(payload.options),
    },
  });

const getPublicDropDownValues = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/dropdown/v1/dropdown/public`,
    params: {
      types: JSON.stringify(payload.options),
    },
  });

const dropdownAPI = {
  getDropDownValues,
  getPublicDropDownValues,
};

export default dropdownAPI;
