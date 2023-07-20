import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/onboarding";

const defaultState = {
  errorMessage: null,
  fetchingDropdowns: false,
  dropDowns: {
    country: [],
    restrictedJurisdiction: [],
  },
  visitors: [],
  relationshipManagers: [],
  isSubmitting: false,
  userInfo: null,
  onboardingData: null,
};

const onboardingReducer = handleActions(
  {
    [actionCreators.doFetchDropdownRequest]: produce((draft) => {
      draft.fetchingDropdowns = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchDropdownSuccess]: produce((draft, { payload: { data } }) => {
      draft.fetchingDropdowns = false;
      draft.dropDowns = data;
    }),
    [actionCreators.doFetchDropdownFailure]: produce((draft, { message }) => {
      draft.fetchingDropdowns = false;
      draft.errorMessage = message;
    }),
    [actionCreators.doInviteUserRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doInviteUserSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [actionCreators.doInviteUserFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doInvitePublicRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doInvitePublicSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.onboardingData = data;
    }),
    [actionCreators.doInvitePublicFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchRMVisitorsRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchRMVisitorsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.visitors = data?.requests;
    }),
    [actionCreators.doFetchRMVisitorsFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchRMRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchRMSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.relationshipManagers = data?.users;
    }),
    [actionCreators.doFetchRMFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doProcessVisitorRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doProcessVisitorSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [actionCreators.doProcessVisitorFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchUserInfoRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doFetchUserInfoSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.userInfo = data;
    }),
    [actionCreators.doFetchUserInfoFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doApproveUserRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doApproveUserSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [actionCreators.doApproveUserFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doAssignAdminRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doAssignAdminSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [actionCreators.doAssignAdminFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doResendOnboardingEmailRequest]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doResendOnboardingEmailSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [actionCreators.doResendOnboardingEmailFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default onboardingReducer;
