import { baseAxiosInstance } from "./helpers";

const getCounterpartyList = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/counterparty/v1/counterparty`,
  });

const addCounterparty = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/counterparty/v1/counterparty`,
  });

const editCounterparty = (payload) =>{
  console.log(payload,'edit')
  return   baseAxiosInstance({
    method: "PATCH",
    data: payload.requestPayload,
    url: `/counterparty/v1/counterparty/${payload.counterpartyId}`,
  });
}

const deleteCounterparty = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    url: `/counterparty/v1/counterparty/${payload.counterpartyId}`,
  });

const getCounterpartySSIList = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/counterparty/v1/counterparty/ssi`,
  });

const addCounterpartySSI = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/counterparty/v1/counterparty/ssi`,
  });

const editCounterpartySSI = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload.requestPayload,
    url: `/counterparty/v1/counterparty/ssi/${payload.counterpartySSIId}`,
  });

const deleteCounterpartySSI = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    url: `/counterparty/v1/counterparty/ssi/${payload.counterpartySSIId}`,
  });

const counterpartyAPI = {
  getCounterpartyList,
  addCounterparty,
  editCounterparty,
  deleteCounterparty,
  getCounterpartySSIList,
  addCounterpartySSI,
  editCounterpartySSI,
  deleteCounterpartySSI,
};

export default counterpartyAPI;
