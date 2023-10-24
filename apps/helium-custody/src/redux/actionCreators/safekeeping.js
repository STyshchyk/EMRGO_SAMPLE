import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/safekeeping";

export const doCreateAccount = createAction(actionTypes.CREATE_ACCOUNT_REQUESTED);
export const doCreateAccountSuccess = createAction(actionTypes.CREATE_ACCOUNT_SUCCEEDED);
export const doCreateAccountFailure = createAction(actionTypes.CREATE_ACCOUNT_FAILED);

export const doReadAccounts = createAction(actionTypes.READ_ACCOUNTS_REQUESTED);
export const doReadAccountsSuccess = createAction(actionTypes.READ_ACCOUNTS_SUCCEEDED);
export const doReadAccountsFailure = createAction(actionTypes.READ_ACCOUNTS_FAILED);

export const doUpdateAccount = createAction(actionTypes.UPDATE_ACCOUNT_REQUESTED);
export const doUpdateAccountSuccess = createAction(actionTypes.UPDATE_ACCOUNT_SUCCEEDED);
export const doUpdateAccountFailure = createAction(actionTypes.UPDATE_ACCOUNT_FAILED);

export const doReadAccountAuditLogs = createAction(actionTypes.READ_ACCOUNT_AUDIT_LOGS_REQUESTED);
export const doReadAccountAuditLogsSuccess = createAction(actionTypes.READ_ACCOUNT_AUDIT_LOGS_SUCCEEDED);
export const doReadAccountAuditLogsFailure = createAction(actionTypes.READ_ACCOUNT_AUDIT_LOGS_FAILED);