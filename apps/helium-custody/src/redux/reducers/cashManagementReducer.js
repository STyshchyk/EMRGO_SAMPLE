import { produce } from "immer";
import { handleActions } from "redux-actions";
import { accountIdentification } from "../../constants/user";


import * as actionCreators from "../actionCreators/cashManagement";

const defaultState = {
  transactions: null,
  errorMessage: null,
  isFetching: false,
  isRequesting: false,
  isSubmitting: false,
  message: null,
  accounts: null,
  sourceOwners: [],
  emrgoOwners: [],
  destinationOwners: [],
  sourceAccounts: [],
  destinationAccounts: [],
  unallocatedTransfers: [],
  isFetchingTransfers: false,
  isFetchingExternalPaymentsAuditData: false,
  externalPaymentsAuditData: null,
};

const isKYCApproved = (entity) =>
  entity?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
     entity.userKycStatus === accountIdentification.KYC_STATUS_APPROVED // for internal entity api

const billingAndPaymentsReducer = handleActions(
  {
    [actionCreators.doFetchTransactions]: produce((draft) => {
      draft.errorMessage = null;
      draft.transactions = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchTransactionsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.transactions = data;
    }),
    [actionCreators.doFetchTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.accounts = data;
    }),
    [actionCreators.doFetchAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchSourceOwners]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchSourceOwnersSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.sourceOwners = data.entities?.filter(isKYCApproved);
    }),
    [actionCreators.doFetchSourceOwnersFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doFetchEmrgoOwners]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchEmrgoOwnersSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.emrgoOwners = data.entities;
    }),
    [actionCreators.doFetchEmrgoOwnersFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchDestinationOwners]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchDestinationOwnersSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.destinationOwners = data.entities?.filter(isKYCApproved);
    }),
    [actionCreators.doFetchDestinationOwnersFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchSourceAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchSourceAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.sourceAccounts = data.data;
    }),
    [actionCreators.doFetchSourceAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchDestinationAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchDestinationAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.destinationAccounts = data.data;
    }),
    [actionCreators.doFetchDestinationAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doMoneyTransfer]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doMoneyTransferSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doMoneyTransferFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchDropdownValues]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchDropdownValuesSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.dropdowns = data;
    }),
    [actionCreators.doFetchDropdownValuesFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doCreateAccount]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doCreateAccountSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doCreateAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doEditAccount]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doEditAccountSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doEditAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchUnallocatedTransactions]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingTransfers = true;
    }),
    [actionCreators.doFetchUnallocatedTransactionsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isFetchingTransfers = false;
        draft.unallocatedTransfers = data.data;
      }
    ),
    [actionCreators.doFetchUnallocatedTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetchingTransfers = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateUnallocatedTransactions]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doUpdateUnallocatedTransactionsSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doUpdateUnallocatedTransactionsFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doResetTransactions]: produce((draft) => {
      draft.transactions = null;
    }),
    [actionCreators.doMoneyTransferInternal]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [actionCreators.doMoneyTransferInternalSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doMoneyTransferInternalFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doFetctExternalPaymentsAuditData]: produce((draft) => {
      draft.isFetchingExternalPaymentsAuditData = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetctExternalPaymentsAuditDataSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.isFetchingExternalPaymentsAuditData = false;
        draft.externalPaymentsAuditData = data;
      }
    ),
    [actionCreators.doFetctExternalPaymentsAuditDataFailure]: produce((draft, { message }) => {
      draft.isFetchingExternalPaymentsAuditData = false;
      draft.errorMessage = message;
    }),

    [actionCreators.doResetExternalPaymentsAuditData]: produce((draft, { message }) => {
      draft.externalPaymentsAuditData = null;
      draft.errorMessage = null;
    }),
  },
  defaultState
);

export default billingAndPaymentsReducer;
