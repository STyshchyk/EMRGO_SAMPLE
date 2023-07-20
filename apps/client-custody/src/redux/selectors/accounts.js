import { createSelector } from "reselect";

export const selectAccountsData = (state) => state.accounts.data;
export const selectIsFetching = (state) => state.accounts.isFetching;
export const selectIsSubmitting = (state) => state.accounts.isSubmitting;
export const selectIsRequesting = (state) => state.accounts.isRequesting;
export const selectFilesUploaded = (state) => state.accounts.filesUploaded;
export const selectFilesUploadInProgress = (state) => state.accounts.uploadInProgress;

export const selectPaymentAccountsData = (state) => state.accounts.paymentAccountsData;
export const selectValidatedAccounts = (state) => state.accounts.validatedAccounts;
export const selectSukukPaymentData = (state) => state.accounts.sukukPaymentData;

export const selectAccounts = createSelector([selectAccountsData], (accountsData) => {
  if (accountsData?.data) {
    return accountsData.data;
  }

  return [];
});

export const selectPaymentAccounts = createSelector(
  [selectPaymentAccountsData],
  (paymentAccountsData) => {
    if (paymentAccountsData?.data) {
      return paymentAccountsData.data;
    }

    return [];
  }
);

export const selectUploadStatus = (state) => state.accounts?.uploadStatus;
export const selectUploadedFiles = (state) => state.accounts.filesUploaded;

export const selectOutgoingInstructionsData = (state) => state.accounts.outgoingInstructions;

export const selectedValidatedPaymentAccounts = createSelector(
  [selectPaymentAccounts],
  (paymentAccounts) => paymentAccounts.filter((paymentAccount) => paymentAccount.isValidated)
);

export const selectReconciledTransactions = (state) => state.accounts.reconciledTransactions;
