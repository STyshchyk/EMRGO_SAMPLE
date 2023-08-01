import { produce } from "immer";
import { combineActions, handleActions } from "redux-actions";

import * as kycActionCreators from "../actionCreators/kyc";

const defaultState = {
  clientClassificationTemplateFileURL: null,
  eoiData: null,
  kycData: null,
  filesUploaded: {},
  uploadStatus: {},
  hasCCTemplateDownloadURL: false,
  isFetching: false,
  isFetchingCCTemplateDownloadURL: false,
  isFetchingUpdatedEOIPartialData: false,
  isFetchingUpdatedKYCPartialData: false,
  isRequesting: false,
  isSending: false,
  isSubmitting: false,
  uploadInProgress: 0,
  message: null,
  errorMessage: null,
  isFetchingClientClassificationDropdownData: false,
  clientClassificationDropdownData: {
    professionalClientQuestions: [],
    investmentExpertise: [],
    academicBackground: [],
    entityAdviceFrequency: [],
    transactionsFrequency: [],
    transactionsVolume: [],
  },
  dropdownData: {},
  paymentAccountsData: null,
  elmUser: null,
};

const kycReducers = handleActions(
  {
    [kycActionCreators.doSendEOIKit]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSending = true;
    }),
    [kycActionCreators.doSendEOIKitSuccess]: produce((draft) => {
      draft.isSending = false;
    }),
    [kycActionCreators.doSendEOIKitFailure]: produce((draft, { payload }) => {
      draft.isSending = false;
      draft.errorMessage = payload;
    }),
    [kycActionCreators.doApproveKYC]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [kycActionCreators.doApproveKYCSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [kycActionCreators.doApproveKYCFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [kycActionCreators.doFetchKYCData]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingKycData = true;
    }),
    [kycActionCreators.doFetchKYCDataSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { payload },
          },
        }
      ) => {
        draft.kycData = payload;
        draft.isFetchingKycData = false;
      }
    ),
    [kycActionCreators.doFetchKYCDataFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingKycData = false;
      draft.errorMessage = payload;
    }),
    [kycActionCreators.doApproveKYC]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [kycActionCreators.doApproveKYCSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [kycActionCreators.doApproveKYCFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [kycActionCreators.doPostKYCData]: produce((draft) => {
      draft.errorMessage = null;
      draft.isSubmitting = true;
      draft.isLoading = true;
    }),
    [kycActionCreators.doPostKYCDataSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { payload },
          },
        }
      ) => {
        Object.keys(payload).forEach((key) => {
          draft.kycData[key] = payload[key];
        });
        draft.errorMessage = null;
        draft.isLoading = false;
        draft.isSubmitting = false;
      }
    ),
    [kycActionCreators.doPostKYCDataFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
      draft.isLoading = false;
    }),
    [kycActionCreators.doUploadKycFile]: produce(
      (
        draft,
        {
          payload: {
            requestPayload: { name },
            index,
            keyName,
          },
        }
      ) => {
        draft.errorMessage = null;
        if (!draft.uploadStatus) draft.uploadStatus = {};
        const key = keyName || name;
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
        draft.uploadInProgress += 1;
      }
    ),
    [kycActionCreators.doUploadKycFileSuccess]: produce((draft, { payload: { data } }) => {
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
      draft.uploadInProgress -= 1;
    }),
    [kycActionCreators.doUploadKycFileFailure]: produce((draft, { payload, key, index }) => {
      draft.uploadInProgress -= 1;
      draft.uploadStatus[key] = false;
      draft.uploadStatus[key][index] = false;
      draft.errorMessage = payload;
    }),
    [kycActionCreators.doFetchClientClassificationDropdowns]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingClientClassificationDropdownData = true;
      draft.isLoading = true;
    }),
    [kycActionCreators.doFetchClientClassificationDropdownsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.clientClassificationDropdownData = { ...data };
        draft.isFetchingClientClassificationDropdownData = false;
        draft.isLoading = false;
      }
    ),
    [kycActionCreators.doFetchClientClassificationDropdownsFailure]: produce(
      (draft, { payload }) => {
        draft.message = payload;
        draft.isFetchingClientClassificationDropdownData = false;
        draft.isLoading = false;
        draft.errorMessage = payload;
      }
    ),

    [kycActionCreators.doFetchDropdowns]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
      draft.isLoading = true;
    }),
    [kycActionCreators.doFetchDropdownsSuccess]: produce((draft, { payload: { data } }) => {
      draft.dropdownData = { ...data };
      draft.isFetching = false;
      draft.isLoading = false;
    }),
    [kycActionCreators.doFetchDropdownsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetching = false;
      draft.isLoading = false;
      draft.errorMessage = payload;
    }),

    [kycActionCreators.doResetUploadedKYCFileState]: produce((draft) => {
      draft.filesUploaded = {};
      draft.uploadStatus = {};
    }),
    [combineActions(
      kycActionCreators.doFetchPaymentAccounts,
      kycActionCreators.doFetchPaymentAccountsByEntityID
    )]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [combineActions(
      kycActionCreators.doFetchPaymentAccountsSuccess,
      kycActionCreators.doFetchPaymentAccountsByEntityIDSuccess
    )]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.paymentAccountsData = data;
    }),
    [combineActions(
      kycActionCreators.doFetchPaymentAccountsFailure,
      kycActionCreators.doFetchPaymentAccountsByEntityIDFailure
    )]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [kycActionCreators.doUploadSupportingDocumentForPaymentAccount]: produce(
      (draft, { payload }) => {
        draft.errorMessage = null;
        const key = payload.keyName;
        draft.filesUploaded[key] = "";
        if (!draft.uploadStatus) draft.uploadStatus = {};
        draft.uploadStatus[key] = true;
        draft.uploadInProgress += 1;
      }
    ),
    [kycActionCreators.doUploadSupportingDocumentForPaymentAccountSuccess]: produce(
      (draft, { payload: { data } }) => {
        const key = data.keyName || data.name;
        draft.filesUploaded[key] = data;
        draft.uploadStatus[key] = false;
        draft.errorMessage = null;
        draft.uploadInProgress -= 1;
      }
    ),
    [kycActionCreators.doUploadSupportingDocumentForPaymentAccountFailure]: produce(
      (draft, { payload, key }) => {
        draft.uploadInProgress -= 1;
        draft.uploadStatus[key] = false;
        draft.errorMessage = payload;
      }
    ),
    [kycActionCreators.doAddPaymentAccount]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isSubmitting = true;
    }),
    [kycActionCreators.doAddPaymentAccountSuccess]: produce((draft, { payload: { data } }) => {
      draft.isSubmitting = false;
      draft.message = data;
    }),
    [kycActionCreators.doAddPaymentAccountFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [kycActionCreators.doEditPaymentAccount]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [kycActionCreators.doEditPaymentAccountSuccess]: produce((draft, { payload: { data } }) => {
      draft.isRequesting = false;
      draft.message = data;
    }),
    [kycActionCreators.doEditPaymentAccountFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [combineActions(
      kycActionCreators.doFetchElmUser,
      kycActionCreators.doFetchPaymentAccountsByEntityID
    )]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [combineActions(
      kycActionCreators.doFetchElmUserSuccess,
      kycActionCreators.doFetchPaymentAccountsByEntityIDSuccess
    )]: produce(
      (
        draft,
        {
          payload: {
            data: { elmUser },
          },
        }
      ) => {
        const elmUserData = elmUser;
        draft.isFetching = false;
        draft.elmUser = elmUserData;
      }
    ),
    [combineActions(
      kycActionCreators.doFetchElmUserFailure,
      kycActionCreators.doFetchPaymentAccountsByEntityIDFailure
    )]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState
);

export default kycReducers;
