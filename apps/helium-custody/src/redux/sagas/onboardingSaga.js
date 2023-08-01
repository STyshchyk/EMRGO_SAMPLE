import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as onboardingActionCreators from "../actionCreators/onboarding";
import * as onboardingActionTypes from "../actionTypes/onboarding";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchDropdown({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getPublicDropDownValues, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchDropdownSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doFetchDropdownFailure(errorMessage));
  }
}

// TODO: TO BE DEPRECATED
function* createOnboarding({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.onboardingAPI.createOnboardingForm,
      payload.requestPayload
    );
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(onboardingActionCreators.doSignupSuccess({ data }));
    if (payload.isRelationshipManager) {
      yield put(onboardingActionCreators.doFetchRMVisitorsRequest());
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doSignupFailure(errorMessage));
  }
}

function* inviteUserByEntityId({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.inviteUser, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(onboardingActionCreators.doInviteUserSuccess({ data }));

    if (typeof payload?.successCallback === "function") payload.successCallback();
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doInviteUserFailure(errorMessage));
  }
}

function* invitePublic({ payload }) {
  const onSuccess = payload.successCallback;
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.invitePublic, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doInvitePublicSuccess({ data }));
    onSuccess();
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doInvitePublicFailure(errorMessage));
  }
}

function* fetchRMVistors({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.fetchVisitors, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchRMVisitorsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doFetchRMVisitorsFailure(errorMessage));
  }
}

function* fetchRM({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.fetchRelationshipManagers, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchRMSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doFetchRMFailure(errorMessage));
  }
}

function* processVisitors({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.processVisitor, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchRMVisitorsRequest());
    yield put(onboardingActionCreators.doProcessVisitorSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doProcessVisitorFailure(errorMessage));
  }
}

function* fetchUserInfo({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.fetchUserInfo, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchUserInfoSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doFetchUserInfoFailure(errorMessage));
  }
}

function* approveUser({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.approveUser, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchRMVisitorsRequest());
    yield put(onboardingActionCreators.doApproveUserSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doApproveUserFailure(errorMessage));
  }
}

function* assignAdmin({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.processVisitor, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doFetchRMVisitorsRequest({ verified: payload.verified }));
    yield put(onboardingActionCreators.doAssignAdminSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doAssignAdminFailure(errorMessage));
  }
}

function* resendOnboardingEmail({ payload }) {
  try {
    const response = yield call(wethaqAPIService.onboardingAPI.resendOnboardingEmail, payload);
    const { data } = response;
    yield put(onboardingActionCreators.doResendOnboardingEmailSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(onboardingActionCreators.doResendOnboardingEmailFailure(errorMessage));
  }
}

const onboardingSaga = [
  takeLatest(onboardingActionTypes.ONBOARDING_DROPDOWN_REQUESTED, fetchDropdown),
  takeLatest(onboardingActionTypes.ONBOARDING_SIGNUP_REQUESTED, createOnboarding),
  takeLatest(onboardingActionTypes.ONBOARDING_INVITE_USER_REQUESTED, inviteUserByEntityId),
  takeLatest(onboardingActionTypes.ONBOARDING_INVITE_PUBLIC_REQUESTED, invitePublic),
  takeLatest(onboardingActionTypes.ONBOARDING_FETCH_RM_VISITORS_REQUESTED, fetchRMVistors),
  takeLatest(onboardingActionTypes.ONBOARDING_FETCH_RM_REQUESTED, fetchRM),
  takeLatest(onboardingActionTypes.ONBOARDING_PROCESS_VISITOR_REQUESTED, processVisitors),
  takeLatest(onboardingActionTypes.ONBOARDING_FETCH_USER_INFO_REQUESTED, fetchUserInfo),
  takeLatest(onboardingActionTypes.ONBOARDING_APPROVE_USER_REQUESTED, approveUser),
  takeLatest(onboardingActionTypes.ONBOARDING_ASSIGN_ADMIN_REQUESTED, assignAdmin),
  takeLatest(
    onboardingActionTypes.ONBOARDING_RESEND_ONBOARDING_EMAIL_REQUESTED,
    resendOnboardingEmail
  ),
];

export default onboardingSaga;
