import { baseAxiosInstance } from './helpers';

const getCounterpartyList = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/counterparty`,
  });

const addCounterparty = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload,
    url: `/v1/counterparty`,
  });

const editCounterparty = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/counterparty/${payload.counterpartyId}`,
  });

const deleteCounterparty = (payload) =>
  baseAxiosInstance({
    method: 'DELETE',
    url: `/v1/counterparty/${payload.counterpartyId}`,
  });

const getCounterpartySSIList = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/counterparty/ssi`,
  });

const addCounterpartySSI = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload,
    url: `/v1/counterparty/ssi`,
  });

const editCounterpartySSI = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/counterparty/ssi/${payload.counterpartySSIId}`,
  });

const deleteCounterpartySSI = (payload) =>
  baseAxiosInstance({
    method: 'DELETE',
    url: `/v1/counterparty/ssi/${payload.counterpartySSIId}`,
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
