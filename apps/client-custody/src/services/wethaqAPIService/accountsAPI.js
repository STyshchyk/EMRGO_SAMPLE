import { baseAxiosInstance } from './helpers';

const getAccounts = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts`,
  });

const addAccount = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload,
    url: `/v1/accounts`,
  });

const editAccount = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/accounts/${payload.accountId}`,
  });

const deleteAccount = (payload) =>
  baseAxiosInstance({
    method: 'DELETE',
    url: `/v1/accounts/${payload.accountId}`,
  });

const addPaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload,
    url: `/v1/accounts/payments`,
  });

const deletePaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'DELETE',
    url: `v1/accounts/payments/${payload.accountId}`,
  });

const editPaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `v1/accounts/payments/${payload.accountId}`,
  });

const getPaymentAccounts = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/payments`,
  });

const setPaymentAccountAsDefault = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    url: `v1/accounts/payments/${payload.accountId}/default`,
  });

const validatePaymentAccount = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `v1/accounts/payments/${payload.accountId}/validation`,
  });

const getValidatedAccounts = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/validated/getBySukukCurrency/${payload.sukukId}`,
  });

const uploadAccountFile = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload.requestPayload,
    url: `/v1/files`,
  });

const updateInvestorPayment = (payload) =>
  baseAxiosInstance({
    method: 'PUT',
    data: payload,
    url: `/v1/payment/sukuk/investor`,
  });

const fetchInvestorPayment = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/payment/sukuk/${payload.sukukId}`,
  });

const fetchOutgoingInstructions = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/payments/outgoing/instruction`,
  });

const createOutgoingInstructions = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload,
    url: `/v1/accounts/payments/outgoing/instruction`,
  });

const fetchUnallocatedTransactions = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/accounts/payments/incoming/unallocated`,
  });

const updateUnallocatedTransactions = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload,
    url: `/v1/accounts/payments/incoming/unallocated/${payload.transactionId}`,
  });

const approveOutgoingPaymentByInstructionID = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/accounts/payments/outgoing/instruction/${payload.instructionId}/approve`,
  });

const finalizeOutgoingPaymentByInstructionID = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/accounts/payments/outgoing/instruction/${payload.instructionId}/finalize`,
  });

const updateOutgoingPaymentByInstructionID = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/accounts/payments/outgoing/instruction/${payload.instructionId}`,
  });

const clientAproveOutgoingPaymentByInstructionID = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    data: payload.requestPayload,
    url: `/v1/accounts/payments/outgoing/instruction/${payload.instructionId}/client/approve`,
  });

const fetchReconciledTransactions = () =>
  baseAxiosInstance({
    method: 'GET',
    url: '/v1/accounts/payments/incoming/transactions',
  });

const accountsAPI = {
  getAccounts,
  addAccount,
  editAccount,
  deleteAccount,
  addPaymentAccount,
  deletePaymentAccount,
  editPaymentAccount,
  getPaymentAccounts,
  setPaymentAccountAsDefault,
  validatePaymentAccount,
  getValidatedAccounts,
  uploadAccountFile,
  updateInvestorPayment,
  fetchInvestorPayment,
  fetchOutgoingInstructions,
  createOutgoingInstructions,
  fetchUnallocatedTransactions,
  updateUnallocatedTransactions,
  approveOutgoingPaymentByInstructionID,
  finalizeOutgoingPaymentByInstructionID,
  updateOutgoingPaymentByInstructionID,
  clientAproveOutgoingPaymentByInstructionID,
  fetchReconciledTransactions,
};

export default accountsAPI;
