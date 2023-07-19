// import { createSelector } from 'reselect';
// import produce from 'immer';

export const selectClientTermsPDF = (state) => state.clientTerms.clientTermsPDF;
export const selectInstructionsFormTemplate = (state) => state.clientTerms.instructionsFormTemplate;
export const selectW8BenFormTemplate = (state) => state.clientTerms.w8benFormTemplate;
export const selectBoardResolutionFormTemplate = (state) => state.clientTerms.boardResolutionFormTemplate;

export const selectFetchingClientTerms = (state) => state.clientTerms.isFetchingTerms;
export const selectFetchingInstructions = (state) => state.clientTerms.isFetchingInstructions;
export const selectFetchingW8Ben = (state) => state.clientTerms.isFetchingW8Ben;
export const selectFetchingBoardResolution = (state) => state.clientTerms.isFetchingBoardResolution;
export const selectUploadStatus = (state) => state.clientTerms?.uploadStatus;
export const selectIsVerifying = (state) => state.clientTerms.isVerifying;
export const selectIsDownloading = (state) => state.clientTerms.isDownloadingFile;
export const selectDownloadStatus = (state) => state.clientTerms.downloadStatus;
export const selectfilesUploaded = (state) => state.clientTerms.filesUploaded;
export const selectIsSubmittingTerms = (state) => state.clientTerms.isSubmittingTerms;
