import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/documents';

const defaultState = {
  isFetchingUsers: false,
  errorMessage: null,
  isLoading: false,
  isFetchingUserFiles: false,
  isDownloadingFile: false,
  isPreviewingFile: false,
  hasFinalTerms: false,
  isProcessing: false,
  users: null,
  uploadStatus: {},
  isFetchingDocusignURL: false,
  docusignURL: null,
  currentPreviewFile: {},
};

const documentsReducers = handleActions(
  {
    [actionCreators.doFetchUsers]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingUsers = true;
    }),
    [actionCreators.doFetchUsersSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { users },
          },
        },
      ) => {
        draft.users = users;
        draft.isFetchingUsers = false;
      },
    ),
    [actionCreators.doFetchUsersFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingUsers = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchUserFiles]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingUserFiles = true;
    }),
    [actionCreators.doFetchUserFilesSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { documents, hasFinalTerms },
          },
        },
      ) => {
        draft.documents = documents;
        draft.hasFinalTerms = hasFinalTerms;
        draft.isFetchingUserFiles = false;
      },
    ),
    [actionCreators.doFetchUserFilesFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingUserFiles = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUploadFile]: produce((draft, { payload }) => {
      draft.errorMessage = null;
      draft.uploadStatus[payload.id] = {
        isUploading: true,
        uploadState: 0,
      };
    }),
    [actionCreators.doUploadFileSuccess]: produce((draft, { payload }) => {
      draft.uploadStatus[payload.id] = {
        isUploading: false,
        uploadState: 1,
      };
    }),
    [actionCreators.doUploadFileFailure]: produce((draft, { payload }) => {
      draft.message = payload.message;
      draft.uploadStatus[payload.id] = {
        isUploading: false,
        uploadState: 2,
      };
      draft.errorMessage = payload;
    }),
    [actionCreators.doDownloadFile]: produce((draft) => {
      draft.errorMessage = null;
      draft.isDownloadingFile = true;
    }),
    [actionCreators.doDownloadFileSuccess]: produce((draft, { payload: { data } }) => {
      draft.downloadLink = data;
      draft.isDownloadingFile = false;
    }),
    [actionCreators.doDownloadFileFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isDownloadingFile = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doProcessFile]: produce((draft) => {
      draft.isProcessing = true;
    }),
    [actionCreators.doProcessFileSuccess]: produce((draft) => {
      draft.isProcessing = false;
    }),
    [actionCreators.doProcessFileFailure]: produce((draft) => {
      draft.isProcessing = false;
    }),
    [actionCreators.doPreviewFile]: produce((draft) => {
      draft.errorMessage = null;
      draft.currentPreviewFile = {};
      draft.isPreviewingFile = true;
    }),
    [actionCreators.doPreviewFileSuccess]: produce((draft, { payload: { data } }) => {
      draft.currentPreviewFile = data;
      draft.isPreviewingFile = false;
    }),
    [actionCreators.doPreviewFileFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isPreviewingFile = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchDocusignURL]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingDocusignURL = true;
      draft.docusignURL = null;
    }),
    [actionCreators.doFetchDocusignURLSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { url },
          },
        },
      ) => {
        draft.docusignURL = url;
        draft.isFetchingDocusignURL = false;
      },
    ),
    [actionCreators.doFetchDocusignURLFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingDocusignURL = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateDocumentPermissions]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doUpdateDocumentPermissionsSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateDocumentPermissionsFailure]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doDocumentUploadRequest]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doDocumentUploadRequestSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doDocumentUploadRequestFailure]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doDocumentMarkObtained]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doDocumentMarkObtainedSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doDocumentMarkObtainedFailure]: produce((draft) => {
      draft.isLoading = false;
    }),
  },
  defaultState,
);

export default documentsReducers;
