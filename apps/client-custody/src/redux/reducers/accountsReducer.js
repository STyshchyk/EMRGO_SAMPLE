import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as accountsActionCreators from "../actionCreators/accounts";

const defaultState = {
  data: null,
  entityAccountsData: null,
  paymentAccountsData: null,
  errorMessage: null,
  validatedAccounts: [],
  uploadStatus: {},
  filesUploaded: {},
  uploadInProgress: false,
  sukukPaymentData: [],
  isFetching: false,
  isRequesting: false,
  isSubmitting: false,
  message: null,
  downloadStatus: {},
  isDownloadingFile: false,
  outgoingInstructions: [],
  reconciledTransactions: [],
};

const accountsReducer = handleActions(
  {
    [accountsActionCreators.doFetchAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [accountsActionCreators.doFetchAccountsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.data = data;
    }),
    [accountsActionCreators.doFetchAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doAddAccount]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [accountsActionCreators.doAddAccountSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [accountsActionCreators.doAddAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doEditAccount]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [accountsActionCreators.doEditAccountSuccess]: produce((draft, { payload: { data } }) => {
      draft.isRequesting = false;
      draft.message = data;
    }),
    [accountsActionCreators.doEditAccountFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doFetchPaymentAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [accountsActionCreators.doFetchPaymentAccountsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isFetching = false;
        draft.paymentAccountsData = data;
      }
    ),
    [accountsActionCreators.doFetchPaymentAccountsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doAddPaymentAccount]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [accountsActionCreators.doAddPaymentAccountSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [accountsActionCreators.doAddPaymentAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doEditPaymentAccount]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [accountsActionCreators.doEditPaymentAccountSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [accountsActionCreators.doEditPaymentAccountFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doFetchValidatedAccounts]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [accountsActionCreators.doFetchValidatedAccountsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.validatedAccounts = data;
        draft.isFetching = false;
      }
    ),
    [accountsActionCreators.doFetchValidatedAccountsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),

    [accountsActionCreators.doUploadAccountFile]: produce(
      (draft, { payload: { index, keyName } }) => {
        draft.errorMessage = null;
        if (!draft.uploadStatus) draft.uploadStatus = {};
        const key = keyName;
        if (index !== undefined) {
          if (!draft.filesUploaded[key]) {
            draft.filesUploaded[key] = [];
          }
          draft.filesUploaded[key][index] = "";
          if (!draft.uploadStatus[key]) {
            draft.uploadStatus[key] = {};
          }
          draft.uploadStatus[key][index] = true;
        } else {
          draft.filesUploaded[key] = "";
          draft.uploadStatus[key] = true;
        }
        draft.uploadInProgress = true;
      }
    ),
    [accountsActionCreators.doUploadAccountFileSuccess]: produce((draft, { payload: { data } }) => {
      const key = data.keyName || data.name;
      if (data.index !== undefined) {
        draft.filesUploaded[key][data.index] = data;
        draft.uploadStatus[key][data.index] = false;
        // draft[data.name][data.index] = data;
      } else {
        draft.filesUploaded[key] = data;
        draft.uploadStatus[key] = false;
      }

      draft.errorMessage = null;
      draft.uploadInProgress = false;
    }),
    [accountsActionCreators.doUploadAccountFileFailure]: produce((draft, { payload, key }) => {
      draft.uploadInProgress = false;
      draft.uploadStatus[key] = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doUpdateInvestorPayment]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [accountsActionCreators.doUpdateInvestorPaymentSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isSubmitting = false;
        draft.message = data;
      }
    ),
    [accountsActionCreators.doUpdateInvestorPaymentFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doFetchInvestorPayment]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [accountsActionCreators.doFetchInvestorPaymentSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.sukukPaymentData = data;
        draft.isFetching = false;
      }
    ),
    [accountsActionCreators.doFetchInvestorPaymentFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetching = false;
    }),
    [accountsActionCreators.doUploadSupportingDocumentForPaymentAccount]: produce(
      (draft, { payload }) => {
        draft.errorMessage = null;
        const key = payload.keyName;
        draft.filesUploaded[key] = "";
        if (!draft.uploadStatus) draft.uploadStatus = {};
        draft.uploadStatus[key] = true;
        draft.uploadInProgress += 1;
      }
    ),
    [accountsActionCreators.doUploadSupportingDocumentForPaymentAccountSuccess]: produce(
      (draft, { payload: { data } }) => {
        const key = data.keyName || data.name;
        draft.filesUploaded[key] = data;
        draft.uploadStatus[key] = false;
        draft.errorMessage = null;
        draft.uploadInProgress -= 1;
      }
    ),
    [accountsActionCreators.doUploadSupportingDocumentForPaymentAccountFailure]: produce(
      (draft, { payload, key }) => {
        draft.uploadInProgress -= 1;
        draft.uploadStatus[key] = false;
        draft.errorMessage = payload;
      }
    ),
    [accountsActionCreators.doFetchUploadedSupportingDocumentFile]: produce(
      (draft, { payload }) => {
        const key = payload.fileName;
        draft.errorMessage = null;
        draft.downloadStatus[key] = true;
        draft.isDownloadingFile = true;
      }
    ),
    [accountsActionCreators.doFetchUploadedSupportingDocumentFileSuccess]: produce(
      (draft, { payload: { data } }) => {
        const key = data.fileName;
        draft.isDownloadingFile = false;
        draft.downloadStatus[key] = data.link;
      }
    ),
    [accountsActionCreators.doFetchUploadedSupportingDocumentFileFailure]: produce(
      (draft, { payload, key }) => {
        draft.isDownloadingFile = false;
        draft.errorMessage = payload;
        draft.downloadStatus[key] = false;
      }
    ),
    [accountsActionCreators.doFetchOutgoingInstructions]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [accountsActionCreators.doFetchOutgoingInstructionsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.outgoingInstructions = data;
        draft.isFetching = false;
      }
    ),
    [accountsActionCreators.doFetchOutgoingInstructionsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetching = false;
    }),
    [accountsActionCreators.doCreateOutgoingInstructions]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [accountsActionCreators.doCreateOutgoingInstructionsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isSubmitting = false;
        draft.message = data;
      }
    ),
    [accountsActionCreators.doCreateOutgoingInstructionsFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [accountsActionCreators.doApproveOutgoingPaymentInstruction]: produce((draft) => {
      draft.isRequesting = true;
      draft.message = null;
      draft.errorMessage = null;
    }),
    [accountsActionCreators.doApproveOutgoingPaymentInstructionSuccess]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.message = payload;
      }
    ),
    [accountsActionCreators.doApproveOutgoingPaymentInstructionFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),
    [accountsActionCreators.doFinalizeOutgoingPaymentInstruction]: produce((draft) => {
      draft.isRequesting = true;
      draft.message = null;
      draft.errorMessage = null;
    }),
    [accountsActionCreators.doFinalizeOutgoingPaymentInstructionSuccess]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.message = payload;
      }
    ),
    [accountsActionCreators.doFinalizeOutgoingPaymentInstructionFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),
    [accountsActionCreators.doUpdateOutgoingPaymentInstruction]: produce((draft) => {
      draft.isRequesting = true;
      draft.message = null;
      draft.errorMessage = null;
    }),
    [accountsActionCreators.doUpdateOutgoingPaymentInstructionSuccess]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.message = payload;
      }
    ),
    [accountsActionCreators.doUpdateOutgoingPaymentInstructionFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),
    [accountsActionCreators.doClientApproveOutgoingPaymentInstruction]: produce((draft) => {
      draft.isRequesting = true;
      draft.message = null;
      draft.errorMessage = null;
    }),
    [accountsActionCreators.doClientApproveOutgoingPaymentInstructionSuccess]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.message = payload;
      }
    ),
    [accountsActionCreators.doClientApproveOutgoingPaymentInstructionFailure]: produce(
      (draft, { payload }) => {
        draft.isRequesting = false;
        draft.errorMessage = payload;
      }
    ),

    [accountsActionCreators.doFetchReconciledTransactions]: produce((draft) => {
      draft.isFetching = true;
      draft.message = null;
      draft.errorMessage = null;
    }),
    [accountsActionCreators.doFetchReconciledTransactionsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data, message },
          },
        }
      ) => {
        draft.isFetching = false;
        draft.reconciledTransactions = data;
        draft.message = message;
      }
    ),
    [accountsActionCreators.doFetchReconciledTransactionsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default accountsReducer;
