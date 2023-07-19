import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/entityGroups';

const defaultState = {
  entityGroupDetails: null,
  entityGroupsList: [],
  isLoading: false,
  message: {},
  isSubmitting: false,
  errorMessage: null,
};

const entityGroupsReducer = handleActions(
  {
    [actionCreators.doFetchEntityGroups]: (state) => ({ ...state, isLoading: true }),
    [actionCreators.doFetchEntityGroupsSuccess]: (state, { payload: { data } }) => ({ ...state, isLoading: false, entityGroupsList: data.groups }),
    [actionCreators.doFetchEntityGroupsFailure]: (state, { payload: { message } }) => ({ ...state, isLoading: false, message }),
    [actionCreators.doFetchEntityGroupDetails]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doFetchEntityGroupDetailsSuccess]: produce((draft, { payload: { data } }) => {
      draft.isLoading = false;
      draft.entityGroupDetails = data.group;
    }),
    [actionCreators.doFetchEntityGroupDetailsFailure]: produce((draft, { payload: { message } }) => {
      draft.isLoading = false;
      draft.message = message;
    }),
    [actionCreators.doRequestEntityGroupUserEdit]: produce((draft) => {
      draft.isLoading = true;
    }),
    [actionCreators.doRequestEntityGroupUserEditSuccess]: produce((draft, { payload: { data } }) => {
      draft.isLoading = false;
      draft.message = data?.message;
    }),
    [actionCreators.doRequestEntityGroupUserEditFailure]: produce((draft, { payload: { message } }) => {
      draft.isLoading = false;
      draft.message = message;
    }),

    [actionCreators.doAddEntityGroup]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doAddEntityGroupSuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doAddEntityGroupFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doRequestAgreement]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isLoading = true;
    }),
    [actionCreators.doRequestAgreementSuccess]: produce((draft, { payload: { data } }) => {
      draft.isLoading = false;
      draft.message = data;
    }),
    [actionCreators.doRequestAgreementFailure]: produce((draft, { payload }) => {
      draft.isLoading = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default entityGroupsReducer;
