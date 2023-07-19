import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/users';

export const doUpdateUserAccountStatus = createAction(actionTypes.UPDATE_USER_ACCOUNT_STATUS_REQUESTED);
export const doUpdateUserAccountStatusSuccess = createAction(actionTypes.UPDATE_USER_ACCOUNT_STATUS_SUCCEEDED);
export const doUpdateUserAccountStatusFailure = createAction(actionTypes.UPDATE_USER_ACCOUNT_STATUS_FAILED);
