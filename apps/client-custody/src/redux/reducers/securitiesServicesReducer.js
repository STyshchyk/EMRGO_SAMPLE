import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as securitiesServicesActionCreators from '../actionCreators/securitiesServices';

const defaultState = {
  errorMessage: null,
  fileURLsFetched: {},
  isFetching: false,
  isRequesting: false,
  isUploading: false,
};

const securitiesServicesReducer = handleActions(
  {
    [securitiesServicesActionCreators.doUploadFile]: produce((draft) => {
      draft.errorMessage = null;
      draft.isUploading = false;
    }),

    [securitiesServicesActionCreators.doUploadFileSuccess]: produce((draft, { payload: { data } }) => {
      draft.isUploading = false;
    }),

    [securitiesServicesActionCreators.doUploadFileFailure]: produce((draft, { payload }) => {
      draft.errorMessage = payload;
      draft.isUploading = false;
    }),

    [securitiesServicesActionCreators.doFetchFile]: produce((draft, { payload }) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),

    [securitiesServicesActionCreators.doFetchFileSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      const { link, key } = data;
      draft.fileURLsFetched[key] = link;
    }),

    [securitiesServicesActionCreators.doFetchFileFailure]: produce((draft, { payload }) => {
      draft.errorMessage = payload;
      draft.isFetching = false;
    }),

    [securitiesServicesActionCreators.doResetFilesState]: produce((draft) => {
      draft.fileURLsFetched = {};
    }),
  },
  defaultState,
);

export default securitiesServicesReducer;
