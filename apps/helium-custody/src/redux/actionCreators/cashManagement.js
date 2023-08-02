import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/cashManagement";

export const doFetchTransactions = createAction(actionTypes.FETCH_TRANSACTIONS_REQUESTED);
export const doFetchTransactionsSuccess = createAction(actionTypes.FETCH_TRANSACTIONS_SUCCEEDED);
export const doFetchTransactionsFailure = createAction(actionTypes.FETCH_TRANSACTIONS_FAILED);

export const doFetchAccounts = createAction(actionTypes.FETCH_ACCOUNTS_REQUESTED);
export const doFetchAccountsSuccess = createAction(actionTypes.FETCH_ACCOUNTS_SUCCEEDED);
export const doFetchAccountsFailure = createAction(actionTypes.FETCH_ACCOUNTS_FAILED);

export const doFetchSourceOwners = createAction(actionTypes.FETCH_SOURCE_OWNERS_REQUESTED);
export const doFetchSourceOwnersSuccess = createAction(actionTypes.FETCH_SOURCE_OWNERS_SUCCEEDED);
export const doFetchSourceOwnersFailure = createAction(actionTypes.FETCH_SOURCE_OWNERS_FAILED);

export const doFetchDestinationOwners = createAction(
  actionTypes.FETCH_DESTINATION_OWNERS_REQUESTED
);
export const doFetchDestinationOwnersSuccess = createAction(
  actionTypes.FETCH_DESTINATION_OWNERS_SUCCEEDED
);
export const doFetchDestinationOwnersFailure = createAction(
  actionTypes.FETCH_DESTINATION_OWNERS_FAILED
);

export const doFetchSourceAccounts = createAction(actionTypes.FETCH_SOURCE_ACCOUNTS_REQUESTED);
export const doFetchSourceAccountsSuccess = createAction(
  actionTypes.FETCH_SOURCE_ACCOUNTS_SUCCEEDED
);
export const doFetchSourceAccountsFailure = createAction(actionTypes.FETCH_SOURCE_ACCOUNTS_FAILED);

export const doFetchDestinationAccounts = createAction(
  actionTypes.FETCH_DESTINATION_ACCOUNTS_REQUESTED
);
export const doFetchDestinationAccountsSuccess = createAction(
  actionTypes.FETCH_DESTINATION_ACCOUNTS_SUCCEEDED
);
export const doFetchDestinationAccountsFailure = createAction(
  actionTypes.FETCH_DESTINATION_ACCOUNTS_FAILED
);

export const doMoneyTransfer = createAction(actionTypes.MONEY_TRANSFER_REQUESTED);
export const doMoneyTransferSuccess = createAction(actionTypes.MONEY_TRANSFER_SUCCEEDED);
export const doMoneyTransferFailure = createAction(actionTypes.MONEY_TRANSFER_FAILED);

export const doFetchDropdownValues = createAction(actionTypes.FETCH_DROPDOWN_VALUES_REQUESTED);
export const doFetchDropdownValuesSuccess = createAction(
  actionTypes.FETCH_DROPDOWN_VALUES_SUCCEEDED
);
export const doFetchDropdownValuesFailure = createAction(actionTypes.FETCH_DROPDOWN_VALUES_FAILED);

export const doCreateAccount = createAction(actionTypes.CREATE_ACCOUNT_REQUESTED);
export const doCreateAccountSuccess = createAction(actionTypes.CREATE_ACCOUNT_SUCCEEDED);
export const doCreateAccountFailure = createAction(actionTypes.CREATE_ACCOUNT_FAILED);

export const doEditAccount = createAction(actionTypes.EDIT_ACCOUNT_REQUESTED);
export const doEditAccountSuccess = createAction(actionTypes.EDIT_ACCOUNT_SUCCEEDED);
export const doEditAccountFailure = createAction(actionTypes.EDIT_ACCOUNT_FAILED);

export const doFetchUnallocatedTransactions = createAction(
  actionTypes.FETCH_UNALLOCATED_INCOMING_TRANSACTIONS_REQUESTED
);
export const doFetchUnallocatedTransactionsSuccess = createAction(
  actionTypes.FETCH_UNALLOCATED_INCOMING_TRANSACTIONS_SUCCEEDED
);
export const doFetchUnallocatedTransactionsFailure = createAction(
  actionTypes.FETCH_UNALLOCATED_INCOMING_TRANSACTIONS_FAILED
);

export const doUpdateUnallocatedTransactions = createAction(
  actionTypes.UPDATE_UNALLOCATED_INCOMING_TRANSACTIONS_REQUESTED
);
export const doUpdateUnallocatedTransactionsSuccess = createAction(
  actionTypes.UPDATE_UNALLOCATED_INCOMING_TRANSACTIONS_SUCCEEDED
);
export const doUpdateUnallocatedTransactionsFailure = createAction(
  actionTypes.UPDATE_UNALLOCATED_INCOMING_TRANSACTIONS_FAILED
);

export const doResetTransactions = createAction(actionTypes.RESET_TRANSACTIONS);

export const doMoneyTransferInternal = createAction(actionTypes.MONEY_TRANSFER_INTERNAL_REQUESTED);
export const doMoneyTransferInternalSuccess = createAction(
  actionTypes.MONEY_TRANSFER_INTERNAL_SUCCEEDED
);
export const doMoneyTransferInternalFailure = createAction(
  actionTypes.MONEY_TRANSFER_INTERNAL_FAILED
);

export const doFetctExternalPaymentsAuditData = createAction(
  actionTypes.FETCH_EXTERNAL_PAYMENTS_AUDIT_DATA_REQUESTED
);
export const doFetctExternalPaymentsAuditDataSuccess = createAction(
  actionTypes.FETCH_EXTERNAL_PAYMENTS_AUDIT_DATA_SUCCEEDED
);
export const doFetctExternalPaymentsAuditDataFailure = createAction(
  actionTypes.FETCH_EXTERNAL_PAYMENTS_AUDIT_DATA_FAILED
);

export const doResetExternalPaymentsAuditData = createAction(
  actionTypes.RESET_EXTERNAL_PAYMENTS_AUDIT_DATA_REQUESTED
);
