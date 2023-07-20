import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import i18n from "../../i18n";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import doResetAppStates from "../actionCreators/app";
import * as authActionCreators from "../actionCreators/auth";
import * as entityActionCreators from "../actionCreators/entities";
import * as actionTypes from "../actionTypes/auth";
import { clearAsyncDataStore } from "../configs/asyncDataStore";
// eslint-disable-next-line import/no-cycle
import { getPersistor } from "../configureStore";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* loginUser({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.authenticateUser, payload);
    const { data } = response;
    if (data.message === "User already logged in") {
      yield call(toast.error, data.message);
      yield call(toast.info, i18n.t("messages:Logging out"));
      yield put(authActionCreators.doLogoutUser());
    } else {
      const messageCode = data.messageCode || null;
      if (messageCode) {
        switch (data.messageCode) {
          case "VERIFY_MFA":
            yield put(authActionCreators.doLoginMFAFailure(data));
            break;
          case "SUCCESS":
            yield put(authActionCreators.doLoginUserSuccess(data));
            break;
          default:
            yield put(authActionCreators.doLoginUserSuccess(data));
        }
      } else {
        yield put(authActionCreators.doLoginUserSuccess(data));
      }
    }

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const messageCode = error?.response?.data?.messageCode;

    if (messageCode) {
      switch (messageCode) {
        case "OTP_REQUIRED":
          yield put(authActionCreators.doLoginOTPFailure(error.response.data));
          break;
        case "INVALID_PASSCODE":
          yield call(toast.error, error.response.data.message);
          yield put(authActionCreators.doLoginOTPFailure(error.response.data));
          break;
        default:
          yield call(toast.error, error.response.data.message);
          yield put(authActionCreators.doLoginUserFailure(error.response.data.message));
      }
    } else {
      const errorMessage = extractErrorMessage(error);
      showToastErrorNotification(error, errorMessage);
      yield put(authActionCreators.doLoginUserFailure(errorMessage));
    }
  }
}

function* fetchCurrentUserData() {
  try {
    yield call(toast.info, i18n.t("messages:Fetching userdata"));
    const response = yield call(wethaqAPIService.authAPI.fetchCurrentUserData);
    const { data } = response;
    yield put(authActionCreators.doFetchCurrentUserDataSuccess(data));
    yield call(toast.success, i18n.t("messages:Userdata is successfully fetched"));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doFetchCurrentUserDataFailure(errorMessage));
  }
}

function* logoutUser() {
  try {
    const response = yield call(wethaqAPIService.authAPI.logoutUser);
    const { data } = response;

    yield put(authActionCreators.doLogoutUserSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doLogoutUserFailure(errorMessage));
  } finally {
    const persistor = getPersistor();
    yield call(persistor.pause);
    yield put(doResetAppStates());
    yield call(clearAsyncDataStore);
    yield call(persistor.persist);
  }
}

function* refreshToken() {
  try {
    const response = yield call(wethaqAPIService.authAPI.refreshToken);
    const { data } = response;

    yield put(authActionCreators.doRefreshTokenSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doRefreshTokenFailure(errorMessage));
  }
}

function* handlePasswordResetRequest({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.requestPasswordResetLink, payload);
    const { data } = response;

    yield put(authActionCreators.doRequestPasswordResetSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doRequestPasswordResetFailure(errorMessage));
  }
}

function* handlePasswordReset({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.requestPasswordReset, payload);
    const { data } = response;

    yield put(authActionCreators.doPasswordResetSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doPasswordResetFailure(errorMessage));
  }
}

function* invitePlatformUser({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.invitePlatformUser, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(authActionCreators.doInvitePlatformUserSuccess({ data }));
    yield put(entityActionCreators.doFetchEntityUsers({ id: payload.entityId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doInvitePlatformUserFailure(errorMessage));
  }
}

function* registerEntityUser({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.registerEntityUser, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(authActionCreators.doRegisterEntityUserSuccess({ data }));
    yield put(entityActionCreators.doFetchEntityUsers({ id: payload.entityId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doRegisterEntityUserFailure(errorMessage));
  }
}

function* fetchUserData({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.getUserData, payload);
    const { data } = response;
    yield put(authActionCreators.doFetchUserDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doFetchUserDataFailure(errorMessage));
  }
}

function* deactivateUser({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.deactivateUser, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(authActionCreators.doDeactivateUserSuccess({ data }));
    yield put(entityActionCreators.doFetchEntityUsers({ id: payload.entityId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doDeactivateUserFailure(errorMessage));
  }
}

function* updateUser({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.updateUser, payload);
    const { data } = response;
    if (data.message.passwordStatus) {
      yield call(toast.success, data.message.passwordStatus);
    }
    if (data.message.emailStatus) {
      yield call(toast.success, data.message.emailStatus);
    }
    if (data.message.displayStatus) {
      yield call(toast.success, data.message.displayStatus);
    }
    yield put(authActionCreators.doUpdateUserSuccess({ data }));
    yield put(entityActionCreators.doFetchEntityUsers({ id: payload.entityId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doDeactivateUserFailure(errorMessage));
  }
}

function* handleMFAReset({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.requestMFAReset, payload);
    const { data } = response;

    yield put(authActionCreators.doMFAResetSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doMFAResetFailure(errorMessage));
  }
}

function* handlePasswordAndMFAResetRequest({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.requestPasswordAndMFAReset, payload);
    const { data } = response;

    yield put(authActionCreators.doPasswordAndMFAResetSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doPasswordAndMFAResetFailure(errorMessage));
  }
}

function* handleMFAPathFetch() {
  try {
    const response = yield call(wethaqAPIService.authAPI.requestMFAPath);
    const { data } = response;

    yield put(authActionCreators.doFetchMFAPathSuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    yield put(authActionCreators.doFetchMFAPathFailure(errorMessage));
  }
}

function* handleMFASetup({ payload }) {
  try {
    const response = yield call(wethaqAPIService.authAPI.setupMFA, payload);
    const { data } = response;

    yield put(authActionCreators.doSetupMFASuccess(data));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(authActionCreators.doSetupMFAFailure(errorMessage));
  }
}

function* handleSessionTimeout({ payload }) {
  try {
    yield put(authActionCreators.doSessionTimeoutDialogSuccess(payload));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

function* handleAccessDenied({ payload }) {
  // eslint-disable-next-line no-useless-catch
  try {
    yield put(authActionCreators.doAccessDeniedDialogSuccess(payload));
    // eslint-disable-next-line no-empty
  } catch (error) {}
}

const authSaga = [
  takeLatest(actionTypes.AUTH_LOGIN_REQUESTED, loginUser),
  takeLatest(actionTypes.AUTH_CURRENT_REQUESTED, fetchCurrentUserData),
  takeLatest(actionTypes.AUTH_LOGOUT_REQUESTED, logoutUser),
  takeLatest(actionTypes.AUTH_PASSWORD_RESET_LINK_REQUESTED, handlePasswordResetRequest),
  takeLatest(actionTypes.AUTH_PASSWORD_RESET_REQUESTED, handlePasswordReset),
  takeLatest(actionTypes.INVITE_PLATFORM_USER_REQUESTED, invitePlatformUser),
  takeLatest(actionTypes.FETCH_USER_DATA_REQUESTED, fetchUserData),
  takeLatest(actionTypes.DEACTIVATE_USER_REQUESTED, deactivateUser),
  takeLatest(actionTypes.UPDATE_USER_REQUESTED, updateUser),
  takeLatest(actionTypes.REGISTER_ENTITY_USER_REQUESTED, registerEntityUser),
  takeLatest(actionTypes.AUTH_MFA_RESET_REQUESTED, handleMFAReset),
  takeLatest(actionTypes.AUTH_PASSWORD_AND_MFA_RESET_REQUESTED, handlePasswordAndMFAResetRequest),
  takeLatest(actionTypes.AUTH_FETCH_MFA_PATH_REQUESTED, handleMFAPathFetch),
  takeLatest(actionTypes.AUTH_SETUP_MFA_REQUESTED, handleMFASetup),
  takeLatest(actionTypes.SESSION_TIMEOUT_REQUESTED, handleSessionTimeout),
  takeLatest(actionTypes.ACCESS_DENIED_REQUESTED, handleAccessDenied),
  takeLatest(actionTypes.AUTH_REFRESH_TOKEN_REQUESTED, refreshToken),
];

export default authSaga;
