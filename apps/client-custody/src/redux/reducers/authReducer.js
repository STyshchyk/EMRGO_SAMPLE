import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/auth";

const defaultState = {
  authenticatedUserObject: {},
  authCredentials: {},
  authFailedObject: {},
  isAuthenticated: false,
  isUserLoggingIn: false,
  isUserLoggingOut: false,
  hasSuccessfullyRequestedPassword: false,
  resetEmailID: "",
  hasSuccessfullyResetPassword: false,
  isRequesting: false,
  hasSuccessfullyResetMFA: false,
  message: null,
  currentEntityGroupIndex: 0,
  errorMessage: null,
  MFAPath: "",
  isSessionTimeoutDialog: false,
  isAccessDeniedDialog: false,
  isEntityTypeAdmin: false,
};

const authReducer = handleActions(
  {
    [actionCreators.doResetAuthState]: produce((draft) => {
      draft.authenticatedUserObject = {};
      draft.authCredentials = {};
      draft.authFailedObject = {};
      draft.isAuthenticated = false;
      draft.isUserLoggingIn = false;
      draft.isUserLoggingOut = false;
      draft.hasSuccessfullyRequestedPassword = false;
      draft.resetEmailID = "";
      draft.hasSuccessfullyResetPassword = false;
      draft.isRequesting = false;
      draft.message = null;
      draft.currentEntityGroupIndex = 0;
      draft.errorMessage = null;
    }),
    [actionCreators.doLoginUser]: produce((draft) => {
      draft.isUserLoggingIn = true;
    }),
    [actionCreators.doLoginUserSuccess]: produce((draft, { payload: { message, user } }) => {
      draft.isUserLoggingIn = false;
      draft.isAuthenticated = true;
      draft.authenticatedUserObject = { ...user };
      draft.message = message;
      draft.isEntityTypeAdmin = user?.isUserEntityAdmin;
    }),
    [actionCreators.doLoginMFAFailure]: produce((draft, { payload }) => {
      draft.isUserLoggingIn = false;
      draft.authFailedObject = payload;
    }),
    [actionCreators.doLoginOTPFailure]: produce((draft, { payload }) => {
      draft.isUserLoggingIn = false;
      draft.authFailedObject = payload;
    }),
    [actionCreators.doLoginUserFailure]: produce((draft, { payload }) => {
      draft.isUserLoggingIn = false;
      draft.message = payload;
      draft.authFailedObject = {};
    }),
    [actionCreators.doFetchCurrentUserData]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doFetchCurrentUserDataSuccess]: produce((draft, { payload: { user } }) => {
      draft.isRequesting = false;
      draft.authenticatedUserObject = { ...user };
    }),
    [actionCreators.doFetchCurrentUserDataFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doLogoutUser]: produce((draft) => {
      draft.isUserLoggingOut = true;
    }),
    [actionCreators.doLogoutUserSuccess]: produce((draft) => {
      draft.isUserLoggingOut = false;
      draft.isAuthenticated = false;
      draft.authenticatedUserObject = {};
      draft.authFailedObject = {};
    }),
    [actionCreators.doLogoutUserFailure]: produce((draft) => {
      draft.isUserLoggingOut = false;
      draft.isAuthenticated = false;
      draft.authenticatedUserObject = {};
    }),
    [actionCreators.doRequestPasswordReset]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
      draft.hasSuccessfullyRequestedPassword = false;
    }),
    [actionCreators.doRequestPasswordResetSuccess]: produce((draft, { payload: { message } }) => {
      draft.isRequesting = false;
      draft.hasSuccessfullyRequestedPassword = true;
      draft.message = message;
    }),
    [actionCreators.doRequestPasswordResetFailure]: produce((draft, { payload }) => {
      draft.message = null;
      draft.isRequesting = false;
      draft.hasSuccessfullyRequestedPassword = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doPasswordReset]: produce((draft) => {
      draft.isRequesting = true;
      draft.hasSuccessfullyResetPassword = false;
      draft.message = undefined;
      draft.errorMessage = undefined;
    }),
    [actionCreators.doPasswordResetSuccess]: produce((draft, { payload: { message } }) => {
      draft.isRequesting = false;
      draft.hasSuccessfullyResetPassword = true;
      draft.message = message;
    }),
    [actionCreators.doPasswordResetFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.hasSuccessfullyResetPassword = false;
      draft.message = undefined;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateUserPermissions]: produce((draft, { payload }) => {
      const permissions = payload.data.permissions
        .filter((data) => data.granted)
        .map((data) => data.permission);
      draft.authenticatedUserObject = { ...draft.authenticatedUserObject, permissions };
    }),
    [actionCreators.doInvitePlatformUser]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doInvitePlatformUserSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doInvitePlatformUserFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doRegisterEntityUser]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doRegisterEntityUserSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doRegisterEntityUserFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doFetchUserData]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doFetchUserDataSuccess]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.authenticatedUserObject = { ...draft.authenticatedUserObject, ...payload.data };
    }),
    [actionCreators.doFetchUserDataFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doDeactivateUser]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doDeactivateUserSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doDeactivateUserFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doUpdateUser]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doUpdateUserSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doUpdateUserFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doUpdateEntityGroupIndex]: produce((draft, { payload: { index } }) => {
      draft.currentEntityGroupIndex = index;
    }),
    [actionCreators.doMFAReset]: produce((draft) => {
      draft.hasSuccessfullyResetMFA = false;
      draft.message = undefined;
      draft.errorMessage = undefined;
    }),
    [actionCreators.doMFAResetSuccess]: produce((draft, { payload: { message } }) => {
      draft.hasSuccessfullyResetMFA = true;
      draft.message = message;
    }),
    [actionCreators.doMFAResetFailure]: produce((draft, { payload }) => {
      // TODO change the following to false. Set to true only for testing
      draft.hasSuccessfullyResetMFA = true;
      draft.message = undefined;
      draft.errorMessage = payload;
    }),
    [actionCreators.doPasswordAndMFAReset]: produce((draft) => {
      draft.isRequesting = true;
      draft.hasSuccessfullyResetPassword = false;
      draft.message = undefined;
      draft.errorMessage = undefined;
    }),
    [actionCreators.doPasswordAndMFAResetSuccess]: produce((draft, { payload: { message } }) => {
      draft.isRequesting = false;
      draft.hasSuccessfullyResetPassword = true;
      draft.message = message;
    }),
    [actionCreators.doPasswordAndMFAResetFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.hasSuccessfullyResetPassword = false;
      draft.message = undefined;
      draft.errorMessage = payload;
    }),
    [actionCreators.doResetAuthCredsState]: produce((draft) => {
      draft.authCredentials = {};
    }),
    [actionCreators.doFetchMFAPath]: produce((draft) => {
      draft.isRequesting = true;
      draft.MFAPath = "";
      draft.errorMessage = undefined;
    }),
    [actionCreators.doFetchMFAPathSuccess]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.MFAPath = payload.otpauth;
    }),
    [actionCreators.doFetchMFAPathFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.MFAPath = "";
      draft.errorMessage = payload;
    }),
    [actionCreators.doSetupMFA]: produce((draft) => {
      draft.isUserLoggingIn = true;
      draft.errorMessage = undefined;
    }),
    [actionCreators.doSetupMFASuccess]: produce((draft, { payload }) => {
      draft.authenticatedUserObject.MFAActive = payload.user.MFAActive;
      draft.authenticatedUserObject.MFAEnabled = payload.user.MFAEnabled;
      draft.authenticatedUserObject.isMFACodeVerified = payload.user.isMFACodeVerified;
    }),
    [actionCreators.doSetupMFAFailure]: produce((draft, { payload }) => {
      draft.isUserLoggingIn = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doSessionTimeoutDialog]: produce((draft) => {
      draft.isSessionTimeoutDialog = false;
    }),
    [actionCreators.doSessionTimeoutDialogSuccess]: produce((draft, { payload }) => {
      draft.isSessionTimeoutDialog = payload;
    }),
    [actionCreators.doAccessDeniedDialog]: produce((draft) => {
      draft.isAccessDeniedDialog = false;
    }),
    [actionCreators.doAccessDeniedDialogSuccess]: produce((draft, { payload }) => {
      draft.isAccessDeniedDialog = payload;
    }),
  },
  defaultState
);

export default authReducer;
