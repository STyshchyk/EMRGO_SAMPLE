import { baseAxiosInstance } from "./helpers";

const createOnboardingForm = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload,
    url: `/v1/onboarding/invite/user`,
  });

const inviteUser = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.requestPayload,
    url: `/v1/onboarding/invite/user`,
  });

const invitePublic = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.data,
    url: `/v1/onboarding/invite/public`,
  });

const fetchVisitors = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/onboarding/dashboard`,
    params: payload,
  });

const fetchRelationshipManagers = () =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/users/relationshipManagers`,
  });

const processVisitor = (payload) =>
  baseAxiosInstance({
    method: "PATCH",
    data: payload,
    url: `/v1/onboarding/dashboard/process`,
  });

const fetchUserInfo = (payload) =>
  baseAxiosInstance({
    method: "GET",
    url: `/v1/onboarding/userInformation`,
    params: {
      userId: payload.userId,
    },
  });

const approveUser = (payload) =>
  baseAxiosInstance({
    method: "POST",
    data: payload.data,
    url: `v1/kyc/verify`,
  });

const resendOnboardingEmail = (payload) =>
  baseAxiosInstance({
    method: "PUT",
    data: payload,
    url: `v1/onboarding/invite/public/resend`,
  });

const onboardingAPI = {
  createOnboardingForm,
  inviteUser,
  invitePublic,
  fetchVisitors,
  fetchRelationshipManagers,
  processVisitor,
  fetchUserInfo,
  approveUser,
  resendOnboardingEmail,
};

export default onboardingAPI;
