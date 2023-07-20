import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as actionCreators from "../actionCreators/paymentAndSettlement";
import * as actionTypes from "../actionTypes/paymentAndSettlement";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchPaymentAndSettlementDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.getPaymentDetails, payload);
    const { data } = response;
    yield put(actionCreators.doFetchDetailsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchDetailsFailure(errorMessage));
  }
}

function* readBlotterDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.readBlotterDetails, payload);
    const { data } = response;
    yield put(actionCreators.doBlotterReadSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doBlotterReadFailure(errorMessage));
  }
}

function* createBlotterDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.updateBlotterDetails, payload);
    const { data } = response;
    yield put(actionCreators.doBlotterCreateSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doBlotterCreateFailure(errorMessage));
  }
}

function* updateBlotterDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.updateBlotterDetails, payload);
    const { data } = response;
    yield put(actionCreators.doBlotterUpdateSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doBlotterUpdateFailure(errorMessage));
  }
}

function* deleteBlotterDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.updateBlotterDetails, payload);
    const { data } = response;
    yield put(actionCreators.doBlotterDeleteSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doBlotterDeleteFailure(errorMessage));
  }
}

function* readDropdownDetails({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;
    yield put(actionCreators.doDropdownReadSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);

    yield put(actionCreators.doDropdownReadFailure(errorMessage));
  }
}

function* settleTrade({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.settleTrade, payload);
    const { data } = response;
    yield put(actionCreators.doDropdownReadSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doDropdownReadFailure(errorMessage));
  }
}

function* updateClientAccountTrade({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.updateClientAccountTrade, payload);
    const { data } = response;
    yield put(actionCreators.doUpdateClientAccountSuccess({ data }));
    yield put(actionCreators.doFetchDetailsRequest());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doUpdateClientAccountFailure(errorMessage));
    yield put(actionCreators.doFetchDetailsRequest());
  }
}

function* approveTrade({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.approveTrade, payload);
    const { data } = response;
    yield put(actionCreators.doTradeApprovalSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doTradeApprovalFailure(errorMessage));
  }
}

function* raiseSettlementInstruction({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.raiseSettlementInstruction, payload);
    const { data } = response;

    yield put(actionCreators.doRaiseSettlementInstructionSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doRaiseSettlementInstructionFailure(errorMessage));
  }
}

function* raiseBulkSettlementInstructions({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.paymentsAPI.raiseBulkSettlementInstructions,
      payload
    );
    const { data } = response;

    yield put(actionCreators.doRaiseBulkSettlementInstructionsSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doRaiseBulkSettlementInstructionsFailure(errorMessage));
  }
}

function* updateSettlementInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.paymentsAPI.updateSettlementInstructionById,
      payload
    );
    const { data } = response;

    yield put(actionCreators.doUpdateSettlementInstructionSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doUpdateSettlementInstructionFailure(errorMessage));
  }
}

function* deleteSettlementInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.paymentsAPI.deleteSettlementInstructionById,
      payload
    );
    const { data } = response;

    yield put(actionCreators.doDeleteSettlementInstructionSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doDeleteSettlementInstructionFailure(errorMessage));
  }
}

function* settleSettlementInstruction({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.paymentsAPI.updateSettlementInstructionStatusById,
      {
        ...payload,
        requestPayload: {
          status: "Settled",
        },
      }
    );
    const { data } = response;

    yield put(actionCreators.doSettleSettlementInstructionSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doSettleSettlementInstructionFailure(errorMessage));
  }
}

function* fetchPaymentsList({ payload }) {
  try {
    const response = yield call(wethaqAPIService.paymentsAPI.getPaymentsList);
    const { data } = response;

    yield put(actionCreators.doFetchPaymentsListSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchPaymentsListFailure(errorMessage));
  }
}

function* changeSettlementInstructionStatus({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.paymentsAPI.updateSettlementInstructionStatusById,
      payload
    );
    const { data } = response;

    yield put(actionCreators.doChangeSettlementInstructionChangeSuccess({ data }));
    yield call(toast.success, data.message);

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doChangeSettlementInstructionChangeFailure(errorMessage));
  }
}

function* fetchSettlementInstructionAuditData({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.paymentsAPI.getSettlementInstructionAuditDataById,
      payload
    );
    const { data } = response;

    yield put(actionCreators.doFetchSettlementInstructionAuditDataSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(actionCreators.doFetchSettlementInstructionAuditDataFailure(errorMessage));
  }
}

const paymentAndSettlementSaga = [
  takeLatest(actionTypes.PAYMENT_DETAILS_REQUESTED, fetchPaymentAndSettlementDetails),
  takeLatest(actionTypes.BLOTTER_READ_REQUESTED, readBlotterDetails),
  takeLatest(actionTypes.BLOTTER_CREATE_REQUESTED, createBlotterDetails),
  takeLatest(actionTypes.BLOTTER_UPDATE_REQUESTED, updateBlotterDetails),
  takeLatest(actionTypes.BLOTTER_DELETE_REQUESTED, deleteBlotterDetails),
  takeLatest(actionTypes.READ_DROPDOWN_REQUESTED, readDropdownDetails),
  takeLatest(actionTypes.TRADE_SETTLEMENT_REQUESTED, settleTrade),
  takeLatest(actionTypes.CLIENT_ACCOUNT_UPDATE_REQUESTED, updateClientAccountTrade),
  takeLatest(actionTypes.TRADE_APPROVAL_REQUESTED, approveTrade),
  takeLatest(actionTypes.RAISE_SETTLEMENT_INSTRUCTION_REQUESTED, raiseSettlementInstruction),
  takeLatest(
    actionTypes.RAISE_BULK_SETTLEMENT_INSTRUCTIONS_REQUESTED,
    raiseBulkSettlementInstructions
  ),
  takeLatest(actionTypes.UPDATE_SETTLEMENT_INSTRUCTION_REQUESTED, updateSettlementInstruction),
  takeLatest(actionTypes.DELETE_SETTLEMENT_INSTRUCTION_REQUESTED, deleteSettlementInstruction),
  takeLatest(actionTypes.SETTLE_SETTLEMENT_INSTRUCTION_REQUESTED, settleSettlementInstruction),
  takeLatest(actionTypes.FETCH_PAYMENTS_LIST_REQUESTED, fetchPaymentsList),
  takeLatest(
    actionTypes.CHANGE_SETTLEMENT_INSTRUCTION_STATUS_REQUESTED,
    changeSettlementInstructionStatus
  ),
  takeLatest(
    actionTypes.FETCH_SETTLEMENT_INSTRUCTION_AUDIT_DATA_REQUESTED,
    fetchSettlementInstructionAuditData
  ),
];

export default paymentAndSettlementSaga;
