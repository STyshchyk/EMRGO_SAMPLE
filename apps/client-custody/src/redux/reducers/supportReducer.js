import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as supportActionCreators from '../actionCreators/support';

const defaultState = {
  dropDowns: {
    supportTicketType: [
      { id: 'c02dc1ec-df47-45eb-84a2-7b28d5467111', name: 'MFA reset', type: 'supportTicketType', value: null, active: true, order: null, key: null, label: null, nameAr: '2FA reset', region: 'AE' },
      {
        id: '947e8449-63ff-4879-afca-1e62889a80a4',
        name: 'Password reset',
        type: 'supportTicketType',
        value: null,
        active: true,
        order: null,
        key: null,
        label: null,
        nameAr: 'Password reset',
        region: 'AE',
      },
    ],
  },
  TFATickets: [],
  currentTFAVerificationDocument: {
    title: '',
  },
  isLoading: false,
  isFetching: false,
  message: null,
  errorMessage: null,
  uploadStatus: {},
  filesUploaded: {},
  uploadInProgress: false,
};

const supportReducer = handleActions(
  {
    [supportActionCreators.doDropdownReadRequest]: produce((draft) => {
      draft.isFetchingDropdowns = true;
      draft.errorMessage = null;
    }),
    [supportActionCreators.doDropdownReadSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingDropdowns = false;
      draft.dropDowns = data;
    }),
    [supportActionCreators.doDropdownReadFailure]: produce((draft, { message }) => {
      draft.isFetchingDropdowns = false;
      draft.errorMessage = message;
    }),
    [supportActionCreators.doFetchTFATickets]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [supportActionCreators.doFetchTFATicketsSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        },
      ) => {
        draft.isFetching = false;
        draft.TFATickets = data;
      },
    ),
    [supportActionCreators.doFetchTFATicketsFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [supportActionCreators.doUploadTFADocument]: produce((draft, { payload: { index, keyName } }) => {
      draft.errorMessage = null;
      if (!draft.uploadStatus) draft.uploadStatus = {};
      const key = keyName;
      if (index !== undefined) {
        if (!draft.filesUploaded[key]) {
          draft.filesUploaded[key] = [];
        }
        draft.filesUploaded[key][index] = '';
        if (!draft.uploadStatus[key]) {
          draft.uploadStatus[key] = {};
        }
        draft.uploadStatus[key][index] = true;
      } else {
        draft.filesUploaded[key] = '';
        draft.uploadStatus[key] = true;
      }
      draft.uploadInProgress = true;
    }),
    [supportActionCreators.doUploadTFADocumentSuccess]: produce((draft, { payload: { data } }) => {
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
    [supportActionCreators.doUploadTFADocumentFailure]: produce((draft, { payload, key, index }) => {
      draft.uploadInProgress = false;
      draft.uploadStatus[key] = false;
      draft.uploadStatus[key][index] = false;
      draft.errorMessage = payload;
    }),
    [supportActionCreators.doFetchTFAVerificationDocument]: produce((draft) => {
      draft.message = null;
      draft.isLoading = true;
      draft.currentTFAVerificationDocument = '';
    }),
    [supportActionCreators.doFetchTFAVerificationDocumentSuccess]: produce((draft, { payload: { data: link } }) => {
      draft.currentTFAVerificationDocument = link.link;
      draft.isLoading = false;
    }),
    [supportActionCreators.doFetchTFAVerificationDocumentFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isLoading = false;
    }),
    [supportActionCreators.doCreateTFATicket]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [supportActionCreators.doCreateTFATicketSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [supportActionCreators.doCreateTFATicketFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [supportActionCreators.doDeleteTFATicket]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [supportActionCreators.doDeleteTFATicketSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [supportActionCreators.doDeleteTFATicketFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [supportActionCreators.doApproveTFATicket]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [supportActionCreators.doApproveTFATicketSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [supportActionCreators.doApproveTFATicketFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
  },
  defaultState,
);

export default supportReducer;
