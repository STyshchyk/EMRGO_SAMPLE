export const selectSupportTicketTypeDropdowns = (state) =>
  state.support?.dropDowns?.supportTicketType;
export const selectIsFetching = (state) => state.support?.isFetching;
export const selectIsLoading = (state) => state.support?.isLoading;
export const selectTFATickets = (state) => state.support?.TFATickets;
export const selectFilesUploaded = (state) => state.support?.filesUploaded;
export const selectFilesUploadInProgress = (state) => state.support?.uploadInProgress;
export const selectCurrentTFAVerificationDocument = (state) =>
  state.support?.currentTFAVerificationDocument;
export const selectUploadStatus = (state) => state.support?.uploadStatus;
