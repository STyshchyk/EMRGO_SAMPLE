import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as clientTermsActionCreators from "../actionCreators/clientTerms";

const defaultState = {
  filesUploaded: {},
  downloadStatus: {},
  uploadInProgress: 0,
  message: null,
  errorMessage: null,
  clientTermsPDF: null,
  instructionsFormTemplate: null,
  w8benFormTemplate: null,
  boardResolutionFormTemplate: null,
  isFetchingTerms: false,
  isFetchingInstructions: false,
  isFetchingW8Ben: false,
  isFetchingBoardResolution: false,
  isSubmittingTerms: false,
  isVerifying: false,
  isDownloadingFile: false,
};

const kycReducers = handleActions(
  {
    [clientTermsActionCreators.doFetchTerms]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingTerms = true;
    }),
    [clientTermsActionCreators.doFetchTermsSuccess]: produce((draft, { payload: { data } }) => {
      draft.clientTermsPDF = data;
      draft.isFetchingTerms = false;
    }),
    [clientTermsActionCreators.doFetchTermsFailure]: produce((draft, { payload }) => {
      draft.isFetchingTerms = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doFetchInstructions]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingInstructions = true;
    }),
    [clientTermsActionCreators.doFetchInstructionsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.instructionsFormTemplate = data;
        draft.isFetchingInstructions = false;
      }
    ),
    [clientTermsActionCreators.doFetchInstructionsFailure]: produce((draft, { payload }) => {
      draft.isFetchingInstructions = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doFetchW8Ben]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingW8Ben = true;
    }),
    [clientTermsActionCreators.doFetchW8BenSuccess]: produce((draft, { payload: { data } }) => {
      draft.w8benFormTemplate = data;
      draft.isFetchingW8Ben = false;
    }),
    [clientTermsActionCreators.doFetchW8BenFailure]: produce((draft, { payload }) => {
      draft.isFetchingW8Ben = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doFetchBoardResolution]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingBoardResolution = true;
    }),
    [clientTermsActionCreators.doFetchBoardResolutionSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.boardResolutionFormTemplate = data;
        draft.isFetchingBoardResolution = false;
        draft.loading = false;
      }
    ),
    [clientTermsActionCreators.doFetchBoardResolutionFailure]: produce((draft, { payload }) => {
      draft.isFetchingBoardResolution = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doUploadFile]: produce((draft, { payload }) => {
      draft.errorMessage = null;
      const key = payload.keyName;
      draft.filesUploaded[key] = "";
      if (!draft.uploadStatus) draft.uploadStatus = {};
      draft.uploadStatus[key] = true;
      draft.uploadInProgress += 1;
    }),
    [clientTermsActionCreators.doUploadFileSuccess]: produce((draft, { payload: { data } }) => {
      const key = data.keyName || data.name;
      draft.filesUploaded[key] = data;
      draft.uploadStatus[key] = false;
      draft.errorMessage = null;
      draft.uploadInProgress -= 1;
    }),
    [clientTermsActionCreators.doUploadFileFailure]: produce((draft, { payload, key }) => {
      draft.uploadInProgress -= 1;
      draft.uploadStatus[key] = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doSubmitTerms]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmittingTerms = true;
    }),
    [clientTermsActionCreators.doSubmitTermsSuccess]: produce((draft) => {
      draft.isSubmittingTerms = false;
    }),
    [clientTermsActionCreators.doSubmitTermsFailure]: produce((draft, { payload }) => {
      draft.isSubmittingTerms = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doSubmitVerifyTerms]: produce((draft) => {
      draft.errorMessage = null;
      draft.isVerifying = true;
    }),
    [clientTermsActionCreators.doSubmitVerifyTermsSuccess]: produce((draft) => {
      draft.isVerifying = false;
    }),
    [clientTermsActionCreators.doSubmitVerifyTermsFailure]: produce((draft, { payload }) => {
      draft.isVerifying = false;
      draft.errorMessage = payload;
    }),
    [clientTermsActionCreators.doFetchUploadedFile]: produce((draft, { payload }) => {
      const key = payload.fileName;
      draft.errorMessage = null;
      draft.downloadStatus[key] = true;
      draft.isDownloadingFile = true;
    }),
    [clientTermsActionCreators.doFetchUploadedFileSuccess]: produce(
      (draft, { payload: { data } }) => {
        const key = data.fileName;
        draft.isDownloadingFile = false;
        draft.downloadStatus[key] = data.link;
      }
    ),
    [clientTermsActionCreators.doFetchUploadedFileFailure]: produce((draft, { payload, key }) => {
      draft.isDownloadingFile = false;
      draft.errorMessage = payload;
      draft.downloadStatus[key] = false;
    }),
  },
  defaultState
);

export default kycReducers;
