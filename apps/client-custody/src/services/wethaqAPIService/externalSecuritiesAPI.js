import { baseAxiosInstance } from "./helpers";

const getExternalSecurities = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/externalSecurities/v1/externalSecurities`,
  });

// ADD FIXED INCOME SECURITY
const addExternalSecurity = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/externalSecurities/v1/externalSecurities`,
  });

const editExternalSecurity = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload.requestPayload,
    url: `/externalSecurities/v1/externalSecurities/${payload.externalSecuritiesId}`,
  });

const deleteExternalSecurity = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    url: `/externalSecurities/v1/externalSecurities/${payload.externalSecuritiesId}`,
  });

const addEquityExternalSecurity = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/externalSecurities/v1/externalSecurities/equity`,
  });

const searchExternalSecurities = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/externalSecurities/v1/externalSecurities/search/${payload.query}`,
  });

const externalSecuritiesAPI = {
  getExternalSecurities,
  addExternalSecurity,
  editExternalSecurity,
  deleteExternalSecurity,
  addEquityExternalSecurity,
  searchExternalSecurities,
};

export default externalSecuritiesAPI;
