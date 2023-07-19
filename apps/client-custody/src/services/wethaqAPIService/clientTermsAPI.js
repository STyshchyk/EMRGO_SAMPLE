import { baseAxiosInstance } from './helpers';

const getClientTerms = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/clientTerms/`,
  });

const submitClientTerms = (payload) =>
  baseAxiosInstance({
    method: 'PUT',
    url: `/v1/clientTerms/submit`,
    data: payload.requestPayload,
  });

// Depreciated
const getInstructions = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/clientTerms/instructions`,
  });

// Depreciated
const getW8Ben = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/clientTerms/w-8ben`,
  });

// Depreciated
const getBoardResolutionSample = () =>
  baseAxiosInstance({
    method: 'GET',
    url: `/v1/clientTerms/board-resolution`,
  });

// Depreciated
const verifyTerms = (payload) =>
  baseAxiosInstance({
    method: 'POST',
    data: payload,
    url: `/v1/clientTerms/verify`,
  });

const clientTermsAPI = {
  getClientTerms,
  getInstructions,
  getW8Ben,
  getBoardResolutionSample,
  submitClientTerms,
  verifyTerms,
};

export default clientTermsAPI;
