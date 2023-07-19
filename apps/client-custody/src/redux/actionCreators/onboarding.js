import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/onboarding';

export const doFetchDropdownRequest = createAction(actionTypes.ONBOARDING_DROPDOWN_REQUESTED);
export const doFetchDropdownSuccess = createAction(actionTypes.ONBOARDING_DROPDOWN_SUCCEEDED);
export const doFetchDropdownFailure = createAction(actionTypes.ONBOARDING_DROPDOWN_FAILED);

export const doSignupRequest = createAction(actionTypes.ONBOARDING_SIGNUP_REQUESTED);
export const doSignupSuccess = createAction(actionTypes.ONBOARDING_SIGNUP_SUCCEEDED);
export const doSignupFailure = createAction(actionTypes.ONBOARDING_SIGNUP_FAILED);

export const doInviteUserRequest = createAction(actionTypes.ONBOARDING_INVITE_USER_REQUESTED);
export const doInviteUserSuccess = createAction(actionTypes.ONBOARDING_INVITE_USER_SUCCEEDED);
export const doInviteUserFailure = createAction(actionTypes.ONBOARDING_INVITE_USER_FAILED);

export const doInvitePublicRequest = createAction(actionTypes.ONBOARDING_INVITE_PUBLIC_REQUESTED);
export const doInvitePublicSuccess = createAction(actionTypes.ONBOARDING_INVITE_PUBLIC_SUCCEEDED);
export const doInvitePublicFailure = createAction(actionTypes.ONBOARDING_INVITE_PUBLIC_FAILED);

export const doFetchRMVisitorsRequest = createAction(actionTypes.ONBOARDING_FETCH_RM_VISITORS_REQUESTED);
export const doFetchRMVisitorsSuccess = createAction(actionTypes.ONBOARDING_FETCH_RM_VISITORS_SUCCEEDED);
export const doFetchRMVisitorsFailure = createAction(actionTypes.ONBOARDING_FETCH_RM_VISITORS_FAILED);

export const doFetchRMRequest = createAction(actionTypes.ONBOARDING_FETCH_RM_REQUESTED);
export const doFetchRMSuccess = createAction(actionTypes.ONBOARDING_FETCH_RM_SUCCEEDED);
export const doFetchRMFailure = createAction(actionTypes.ONBOARDING_FETCH_RM_FAILED);

export const doProcessVisitorRequest = createAction(actionTypes.ONBOARDING_PROCESS_VISITOR_REQUESTED);
export const doProcessVisitorSuccess = createAction(actionTypes.ONBOARDING_PROCESS_VISITOR_SUCCEEDED);
export const doProcessVisitorFailure = createAction(actionTypes.ONBOARDING_PROCESS_VISITOR_FAILED);

export const doFetchUserInfoRequest = createAction(actionTypes.ONBOARDING_FETCH_USER_INFO_REQUESTED);
export const doFetchUserInfoSuccess = createAction(actionTypes.ONBOARDING_FETCH_USER_INFO_SUCCEEDED);
export const doFetchUserInfoFailure = createAction(actionTypes.ONBOARDING_FETCH_USER_INFO_FAILED);

export const doApproveUserRequest = createAction(actionTypes.ONBOARDING_APPROVE_USER_REQUESTED);
export const doApproveUserSuccess = createAction(actionTypes.ONBOARDING_APPROVE_USER_SUCCEEDED);
export const doApproveUserFailure = createAction(actionTypes.ONBOARDING_APPROVE_USER_FAILED);

export const doAssignAdminRequest = createAction(actionTypes.ONBOARDING_ASSIGN_ADMIN_REQUESTED);
export const doAssignAdminSuccess = createAction(actionTypes.ONBOARDING_ASSIGN_ADMIN_SUCCEEDED);
export const doAssignAdminFailure = createAction(actionTypes.ONBOARDING_ASSIGN_ADMIN_FAILED);

export const doResendOnboardingEmailRequest = createAction(actionTypes.ONBOARDING_RESEND_ONBOARDING_EMAIL_REQUESTED);
export const doResendOnboardingEmailSuccess = createAction(actionTypes.ONBOARDING_RESEND_ONBOARDING_EMAIL_SUCCEEDED);
export const doResendOnboardingEmailFailure = createAction(actionTypes.ONBOARDING_RESEND_ONBOARDING_EMAIL_FAILED);
