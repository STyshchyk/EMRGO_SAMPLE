import { baseAxiosInstance } from './helpers';

const sendEOIKit = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.requestPayload,
    url: `/v1/onboarding/eoi`,
  });

const inviteEntity = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.data,
    url: `/v1/onboarding/invite`,
  });

const uploadKYCFileByEntityId = (payload) =>
  baseAxiosInstance({
    method: 'PUT',
    data: payload.requestPayload,
    url: `/v1/kyc/${payload.entityId}`,
  });

const fetchKYCDetailsByEntityId = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.requestPayload,
    url: `/v1/kyc/${payload.entityId}/details`,
  });

const postKYCDocumentData = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.requestPayload,
    url: `/v1/kyc/${payload.entityId}/modify`,
  });

const approveKYC = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.data,
    url: `v1/kyc/verify`,
  });

const getPaymentAccounts = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/kyc/payments`,
  });

const getPaymentAccountsByEntityID = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/kyc/payments/${payload?.entityId}`,
  });

const addPaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.requestPayload,
    url: `/v1/accounts/kyc/payments`,
  });

const deletePaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'DELETE',
    url: `v1/accounts/kyc/payments/${payload.accountId}`,
  });

const editPaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `v1/accounts/kyc/payments/${payload.accountId}`,
  });

const setPaymentAccountAsDefault = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    url: `v1/accounts/kyc/payments/${payload.accountId}/default`,
  });

const validatePaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `v1/accounts/kyc/payments/${payload.accountId}/validation`,
  });

const fetchElmUser = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/auth/elmUser`,
  });

const kycAPI = {
  approveKYC,
  fetchKYCDetailsByEntityId,
  inviteEntity,
  postKYCDocumentData,
  sendEOIKit,
  uploadKYCFileByEntityId,
  getPaymentAccounts,
  addPaymentAccount,
  deletePaymentAccount,
  editPaymentAccount,
  setPaymentAccountAsDefault,
  validatePaymentAccount,
  getPaymentAccountsByEntityID,
  fetchElmUser,
};

export default kycAPI;
