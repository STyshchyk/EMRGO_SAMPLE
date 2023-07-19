import { baseAxiosInstance } from './helpers';

const getAdmissionTermsheetDetails = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/admission/terms/${payload.sukukId}`,
  });

const getAdmissionTerms = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/admission/terms/form/${payload.sukukId}/generate`,
  });

const submitAdmissionTerms = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/admission/finalize/${payload.sukukId}`,
  });

const getSukukStatus = (payload) =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/sukuk/status/${payload.sukukId}`,
  });

const submitSukukByIDForAdmission = (payload) =>
  baseAxiosInstance({
    method: 'PATCH',
    url: `/v1/admission/submit/${payload.sukukId}`,
    data: payload.requestPayload,
  });

const manageSukukByID = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    url: `/v1/admission/manage/${payload.sukukId}`,
    data: payload.requestPayload,
  });

const admissionAPI = {
  getAdmissionTermsheetDetails,
  getAdmissionTerms,
  submitAdmissionTerms,
  getSukukStatus,
  submitSukukByIDForAdmission,
  manageSukukByID,
};

export default admissionAPI;
