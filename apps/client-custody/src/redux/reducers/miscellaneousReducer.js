import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/miscellaneous';

const defaultState = {
  isFetchingDocument: false,
  documentName: '',
  documentLink: '',
  fileLink: '',
  isLoading: false,
  tableConfig: [],
};

const miscellaneousReducer = handleActions(
  {
    [actionCreators.doFetchDocumentLinkRequest]: produce((draft, { payload }) => {
      draft.isFetchingDocument = true;
      draft.documentLink = '';
      draft.documentName = payload.params.fileName;
    }),
    [actionCreators.doFetchDocumentLinkSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingDocument = false;
      draft.documentLink = data.link;
    }),
    [actionCreators.doFetchDocumentLinkFailure]: produce((draft) => {
      draft.isFetchingDocument = false;
    }),
    [actionCreators.doFetchStaticFileRequest]: produce((draft) => {
      draft.isFetchingDocument = true;
      draft.fileLink = '';
    }),
    [actionCreators.doFetchStaticFileSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetchingDocument = false;
      draft.fileLink = data.link;
    }),
    [actionCreators.doFetchStaticFileFailure]: produce((draft) => {
      draft.isFetchingDocument = false;
    }),
    [actionCreators.doReadTableConfigRequest]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doReadTableConfigSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { settings },
          },
        },
      ) => {
        draft.isLoading = false;
        draft.tableConfig = settings;
      },
    ),

    [actionCreators.doReadTableConfigFailure]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateTableConfigRequest]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doUpdateTableConfigSuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [actionCreators.doUpdateTableConfigFailure]: produce((draft) => {
      draft.isLoading = false;
    }),
  },
  defaultState,
);

export default miscellaneousReducer;
