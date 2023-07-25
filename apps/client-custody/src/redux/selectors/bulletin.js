export const selectBulletinTypeDropdowns = (state) => state.bulletins?.dropDowns;

export const selectIsLoading = (state) => state.bulletins?.isLoading;
export const selectBulletins = (state) => state.bulletins?.bulletins;
export const selectFilesUploaded = (state) => state.bulletins?.filesUploaded;
export const selectFilesUploadInProgress = (state) => state.bulletins?.uploadInProgress;
export const selectCurrentBulletinDocument = (state) => state.bulletins?.currentBulletinDocument;
