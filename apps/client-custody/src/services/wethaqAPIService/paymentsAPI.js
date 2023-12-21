import { baseAxiosInstance } from "./helpers";

// !DEPRECATED!!! 21/3/2022 (Only blotter page use it)
const getPaymentDetails = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/payment`,
    params: payload,
  });

const readBlotterDetails = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/payment/blotter`,
    params: payload,
  });

const updateBlotterDetails = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload.data,
    url: `/v1/payment/blotter`,
    params: payload.params,
  });

const settleTrade = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/payment/settle/${payload.id}`,
  });

const updateClientAccountTrade = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/payment/account/${payload.entityGroupId}`,
    data: payload.data,
  });

const approveTrade = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    url: `/v1/payment/approve/${payload.id}`,
  });

const raiseSettlementInstruction = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: "/payments/v2/payment/external/settlement-instructions",
    data: payload.requestPayload,
  });

const updateSettlementInstructionById = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/payments/v1/payment/external/settlement-instructions/${payload.settlementId}`,
    data: payload.requestPayload,
  });

const deleteSettlementInstructionById = (payload) =>
  baseAxiosInstance({
    method: "DELETE",
    url: `/payments/v1/payment/external/settlement-instructions/${payload.settlementId}`,
  });

const updateSettlementInstructionStatusById = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    url: `/payments/v1/payment/external/status/${payload.settlementId}`,
    data: payload.requestPayload,
  });

const getPaymentsList = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: "/payments/v2/payment/list",
  });

const getSettlementInstructionAuditDataById = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/payments/v1/payment/external/settlement-instructions/audit/${payload.settlementId}`,
  });

const raiseBulkSettlementInstructions = (payload) =>
  baseAxiosInstance({
    method: "POST",
    url: "/payments/v2/payment/external/bulk-settlement-instructions",
    data: payload.requestPayload,
  });

const paymentsAPI = {
  getPaymentDetails,
  readBlotterDetails,
  settleTrade,
  updateBlotterDetails,
  updateClientAccountTrade,
  approveTrade,
  raiseSettlementInstruction,
  updateSettlementInstructionById,
  deleteSettlementInstructionById,
  updateSettlementInstructionStatusById,
  getPaymentsList,
  getSettlementInstructionAuditDataById,
  raiseBulkSettlementInstructions,
};

export default paymentsAPI;
