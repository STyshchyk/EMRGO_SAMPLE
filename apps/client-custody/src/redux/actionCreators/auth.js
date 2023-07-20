import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/auth";

export const doResetAuthState = createAction(actionTypes.AUTH_RESET_LOGIN_STATE);

export const doLoginUser = createAction(actionTypes.AUTH_LOGIN_REQUESTED);
export const doLoginUserSuccess = createAction(actionTypes.AUTH_LOGIN_SUCCEEDED);
export const doLoginMFAFailure = createAction(actionTypes.AUTH_LOGIN_MFA_SETUP_FAILED);
export const doLoginOTPFailure = createAction(actionTypes.AUTH_LOGIN_OTP_REQUIRED_FAILED);
export const doLoginUserFailure = createAction(actionTypes.AUTH_LOGIN_FAILED);

export const doFetchCurrentUserData = createAction(actionTypes.AUTH_CURRENT_REQUESTED);
export const doFetchCurrentUserDataSuccess = createAction(actionTypes.AUTH_CURRENT_SUCCEEDED);
export const doFetchCurrentUserDataFailure = createAction(actionTypes.AUTH_CURRENT_FAILED);

export const doLogoutUser = createAction(actionTypes.AUTH_LOGOUT_REQUESTED);
export const doLogoutUserSuccess = createAction(actionTypes.AUTH_LOGOUT_SUCCEEDED);
export const doLogoutUserFailure = createAction(actionTypes.AUTH_LOGOUT_FAILED);

export const doRefreshToken = createAction(actionTypes.AUTH_REFRESH_TOKEN_REQUESTED);
export const doRefreshTokenSuccess = createAction(actionTypes.AUTH_REFRESH_TOKEN_SUCCEEDED);
export const doRefreshTokenFailure = createAction(actionTypes.AUTH_REFRESH_TOKEN_FAILED);

export const doRequestPasswordReset = createAction(actionTypes.AUTH_PASSWORD_RESET_LINK_REQUESTED);
export const doRequestPasswordResetSuccess = createAction(
  actionTypes.AUTH_PASSWORD_RESET_LINK_SUCCEEDED
);
export const doRequestPasswordResetFailure = createAction(
  actionTypes.AUTH_PASSWORD_RESET_LINK_FAILED
);

export const doPasswordReset = createAction(actionTypes.AUTH_PASSWORD_RESET_REQUESTED);
export const doPasswordResetSuccess = createAction(actionTypes.AUTH_PASSWORD_RESET_SUCCEEDED);
export const doPasswordResetFailure = createAction(actionTypes.AUTH_PASSWORD_RESET_FAILED);

export const doUpdateUserPermissions = createAction(actionTypes.AUTH_UPDATE_USER_PERMISSION_LIST);

export const doInvitePlatformUser = createAction(actionTypes.INVITE_PLATFORM_USER_REQUESTED);
export const doInvitePlatformUserSuccess = createAction(actionTypes.INVITE_PLATFORM_USER_SUCCEEDED);
export const doInvitePlatformUserFailure = createAction(actionTypes.INVITE_PLATFORM_USER_FAILED);

export const doRegisterEntityUser = createAction(actionTypes.REGISTER_ENTITY_USER_REQUESTED);
export const doRegisterEntityUserSuccess = createAction(actionTypes.REGISTER_ENTITY_USER_SUCCEEDED);
export const doRegisterEntityUserFailure = createAction(actionTypes.REGISTER_ENTITY_USER_FAILED);

// TODO: Move the following to a new redux flow for user functions

export const doFetchUserData = createAction(actionTypes.FETCH_USER_DATA_REQUESTED);
export const doFetchUserDataSuccess = createAction(actionTypes.FETCH_USER_DATA_SUCCEEDED);
export const doFetchUserDataFailure = createAction(actionTypes.FETCH_USER_DATA_FAILED);

export const doDeactivateUser = createAction(actionTypes.DEACTIVATE_USER_REQUESTED);
export const doDeactivateUserSuccess = createAction(actionTypes.DEACTIVATE_USER_SUCCEEDED);
export const doDeactivateUserFailure = createAction(actionTypes.DEACTIVATE_USER_FAILED);

export const doUpdateUser = createAction(actionTypes.UPDATE_USER_REQUESTED);
export const doUpdateUserSuccess = createAction(actionTypes.UPDATE_USER_SUCCEEDED);
export const doUpdateUserFailure = createAction(actionTypes.UPDATE_USER_FAILED);

export const doUpdateEntityGroupIndex = createAction(actionTypes.ENTITY_GROUPS_UPDATE_INDEX);

export const doMFAReset = createAction(actionTypes.AUTH_MFA_RESET_REQUESTED);
export const doMFAResetSuccess = createAction(actionTypes.AUTH_MFA_RESET_SUCCEEDED);
export const doMFAResetFailure = createAction(actionTypes.AUTH_MFA_RESET_FAILED);

export const doPasswordAndMFAReset = createAction(
  actionTypes.AUTH_PASSWORD_AND_MFA_RESET_REQUESTED
);
export const doPasswordAndMFAResetSuccess = createAction(
  actionTypes.AUTH_PASSWORD_AND_MFA_RESET_SUCCEEDED
);
export const doPasswordAndMFAResetFailure = createAction(
  actionTypes.AUTH_PASSWORD_AND_MFA_RESET_FAILED
);

export const doResetAuthCredsState = createAction(actionTypes.AUTH_CREDS_STATE_RESET_REQUESTED);

export const doFetchMFAPath = createAction(actionTypes.AUTH_FETCH_MFA_PATH_REQUESTED);
export const doFetchMFAPathSuccess = createAction(actionTypes.AUTH_FETCH_MFA_PATH_SUCCEEDED);
export const doFetchMFAPathFailure = createAction(actionTypes.AUTH_FETCH_MFA_PATH_FAILED);

export const doSetupMFA = createAction(actionTypes.AUTH_SETUP_MFA_REQUESTED);
export const doSetupMFASuccess = createAction(actionTypes.AUTH_SETUP_MFA_SUCCEEDED);
export const doSetupMFAFailure = createAction(actionTypes.AUTH_SETUP_MFA_FAILED);

export const doSessionTimeoutDialog = createAction(actionTypes.SESSION_TIMEOUT_REQUESTED);
export const doSessionTimeoutDialogSuccess = createAction(actionTypes.SESSION_TIMEOUT_SUCCEEDED);

export const doAccessDeniedDialog = createAction(actionTypes.ACCESS_DENIED_REQUESTED);
export const doAccessDeniedDialogSuccess = createAction(actionTypes.ACCESS_DENIED_SUCCEEDED);
