import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/bulletins";

const defaultState = {
  dropDowns: {
    homepageItemType: [],
  },
  isFetchingDropdowns: true,
  bulletins: [],
  currentBulletinDocument: "",
  isLoading: false,
  filesUploaded: {},
  uploadStatus: {},
  uploadInProgress: false,
  message: [],
  errorMessage: null,
};

const notificationReducer = handleActions(
  {
    [actionCreators.doDropdownReadRequest]: produce((draft) => {
      draft.isFetchingDropdowns = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doDropdownReadSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingDropdowns = false;
      draft.dropDowns = data;
    }),
    [actionCreators.doDropdownReadFailure]: produce((draft, { message }) => {
      draft.isFetchingDropdowns = false;
      draft.errorMessage = message;
    }),
    [actionCreators.doFetchBulletinData]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
    }),
    [actionCreators.doFetchBulletinDataSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.bulletins = data;
        draft.isLoading = false;
      }
    ),
    [actionCreators.doFetchBulletinDataFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),
    [actionCreators.doUploadBulletinFile]: produce((draft, { payload: { index, keyName } }) => {
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
    }),
    [actionCreators.doUploadBulletinFileSuccess]: produce((draft, { payload: { data } }) => {
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
    [actionCreators.doUploadBulletinFileFailure]: produce((draft, { payload, key, index }) => {
      draft.uploadInProgress = false;
      draft.uploadStatus[key] = false;
      draft.uploadStatus[key][index] = false;
      draft.errorMessage = payload;
    }),

    [actionCreators.doCreateBulletin]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doCreateBulletinSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doCreateBulletinFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [actionCreators.doDeleteBulletin]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doDeleteBulletinSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doDeleteBulletinFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [actionCreators.doFetchBulletinDocument]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
      draft.currentBulletinDocument = "";
    }),
    [actionCreators.doFetchBulletinDocumentSuccess]: produce(
      (draft, { payload: { data: link } }) => {
        draft.currentBulletinDocument = link.link;
        draft.isLoading = false;
      }
    ),
    [actionCreators.doFetchBulletinDocumentFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateBulletin]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateBulletinSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateBulletinFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
  },
  defaultState
);

export default notificationReducer;
