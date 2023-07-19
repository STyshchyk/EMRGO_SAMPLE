import { baseAxiosInstance } from './helpers';

// PATCH {{BaseURL}}/v1/users/:userId/status

// DEPRECATED
const deactivateUser = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    url: `/v1/users/${payload.id}/deactivate`,
  });

const getUserData = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/users/${payload.data.id}`,
  });

const updateUser = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.data,
    url: `/v1/users/${payload.id}`,
  });

const getIssuerClients = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/users/issuerClients`,
  });

const getCoArrangers = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/users/coArrangers`,
  });

const getInvestors = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/users/investors/${payload.sukukId}`,
  });

const getIssuers = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/users/issuers`,
  });

const updateUserAccountStatus = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    url: `/v1/users/${payload.userId}/status`,
    data: payload.requestPayload,
  });

const userAPI = {
  getIssuerClients,
  getIssuers,
  getCoArrangers,
  getUserData,
  updateUser,
  getInvestors,
  deactivateUser,
  updateUserAccountStatus,
};

export default userAPI;
