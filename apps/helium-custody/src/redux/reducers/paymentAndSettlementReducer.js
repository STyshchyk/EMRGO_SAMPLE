import { produce } from "immer";
import { handleActions } from "redux-actions";

// import { loadTest } from '../helpers';

import * as actionCreators from "../actionCreators/paymentAndSettlement";

const defaultState = {
  details: [],
  dropDowns: {
    currency: [],
    country: [],
  },
  errorMessage: null,
  firstLoadFlag: false,
  isFetching: false,
  isLoading: true, // ???
  isRequesting: false,
  isSubmitting: false,
  paymentsList: [],
  isFetchingPaymentsList: false,
  isFetchingSettlementInstructionAuditData: false,
  settlementInstructionData: null,
};

const paymentAndSettlementReducer = handleActions(
  {
    [actionCreators.doFetchDetailsRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchDetailsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isLoading = false;
      const investorData = data.investors?.map((investor) => ({
        ...investor,
        action: {
          readyToSettle: investor.readyToSettle,
          tradeId: investor.id,
          investor,
        },
        subscriptionAmount: investor.subscriptionAmount,
        sukuk: {
          ...investor.sukuk,
          countryObject:
            investor.sukuk.countryObject !== ""
              ? investor.sukuk.countryObject
              : "United Arab Emirates",
          currencyName: investor.sukuk.currencyName
            ? investor.sukuk.currencyName
            : { name: "AED", label: "UAE Dhiram" },
        },
        investorEntity: {
          ...investor.investorEntity,
        },
      }));

      // draft.details = loadTest(investorData, 11111);
      draft.details = investorData;
    }),
    [actionCreators.doFetchDetailsFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [actionCreators.doDropdownReadRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doDropdownReadSuccess]: produce((draft, { payload: { data } }) => {
      draft.isLoading = false;
      draft.dropDowns = data;
    }),
    [actionCreators.doDropdownReadFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doTradeSettlementRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doTradeSettlementSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doTradeSettlementFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doUpdateClientAccountRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateClientAccountSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateClientAccountFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doTradeApprovalRequest]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doTradeApprovalSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doTradeApprovalFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [actionCreators.doRaiseSettlementInstruction]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doRaiseSettlementInstructionSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doRaiseSettlementInstructionFailure]: produce((draft, { message }) => {
      draft.isSubmitting = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doRaiseBulkSettlementInstructions]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doRaiseBulkSettlementInstructionsSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doRaiseBulkSettlementInstructionsFailure]: produce((draft, { message }) => {
      draft.isSubmitting = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doFetchPaymentsList]: produce((draft) => {
      draft.isFetchingPaymentsList = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchPaymentsListSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingPaymentsList = false;
      draft.paymentsList = data;
    }),
    [actionCreators.doFetchPaymentsListFailure]: produce((draft, { message }) => {
      draft.isFetchingPaymentsList = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doFetchSettlementInstructionAuditData]: produce((draft) => {
      draft.isFetchingSettlementInstructionAuditData = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchSettlementInstructionAuditDataSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.isFetchingSettlementInstructionAuditData = false;
        draft.settlementInstructionData = data;
      }
    ),
    [actionCreators.doFetchSettlementInstructionAuditDataFailure]: produce((draft, { message }) => {
      draft.isFetchingSettlementInstructionAuditData = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doResetSettlementInstructionAuditData]: produce((draft, { message }) => {
      draft.settlementInstructionData = null;
      draft.errorMessage = null;
    }),
  },
  defaultState
);

export default paymentAndSettlementReducer;
