export const selectUsers = (state) => state.documents.users;
export const selectIsFetchingUsers = (state) => state.documents.isFetching;
export const selectUserFiles = (state) => state.documents.documents;
export const selectIsFetchingUserFiles = (state) => state.documents.isFetchingUserFiles;
export const selectIsFetchingDocusignURL = (state) => state.documents.isFetchingDocusignURL;
export const selectDocusignURL = (state) => state.documents.docusignURL;
export const selectHasFinalTerms = (state) => state.documents.hasFinalTerms;
export const selectFetchingPreviewDocument = (state) => state.documents.isPreviewingFile;
export const selectCurrentPreviewDocument = (state) => state.documents.currentPreviewFile;

export const selectUploadStatus = (state) => state.documents.uploadStatus;
export const selectIsProcessing = (state) => state.documents.isProcessing;
export const selectIsUploadComplete = (state) => state.documents.isUploadComplete;
