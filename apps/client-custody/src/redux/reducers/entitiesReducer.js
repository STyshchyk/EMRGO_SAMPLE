import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/entities';

const defaultState = {
  entitiesList: [],
  entityUsersList: [],
  errorMessage: null,
  isFetching: false,
  isLoading: false,
  isSubmitting: false,
  message: {},
  parentEntities: null,
  entityUsers: [],
};

const moduleReducer = handleActions(
  {
    [actionCreators.doFetchEntities]: (state) => ({ ...state, isLoading: true }),
    [actionCreators.doFetchEntitiesSuccess]: (state, { payload: { data } }) => ({ ...state, isLoading: false, entitiesList: data.entities }),
    [actionCreators.doFetchEntitiesFailure]: (state, { payload: { message } }) => ({ ...state, isLoading: false, message }),

    /*

    # TODO: FIND AND FIX SHALLOW COPYING BUGS SOMEWHERE IN KYC PAGE COMPONENT THAT USES THE MUI TABLE

    [actionCreators.doFetchEntities]: produce((draft) => {
      draft.errorMessage = null;
      draft.isLoading = true;
    }),
    [actionCreators.doFetchEntitiesSuccess]: produce((draft, { payload: { data } }) => {
      draft.isLoading = false;
      draft.entitiesList = data.entities;
    }),
    [actionCreators.doFetchEntitiesFailure]: produce((draft, { payload }) => {
      draft.isLoading = false;
      draft.errorMessage = payload;
    }),
    */

    [actionCreators.doFetchParentEntities]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchParentEntitiesSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.parentEntities = data;
    }),
    [actionCreators.doFetchParentEntitiesFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doAddParentEntity]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doAddParentEntitySuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doAddParentEntityFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateParentEntity]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateParentEntitySuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doUpdateParentEntityFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doDeactivateParentEntity]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doDeactivateParentEntitySuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doDeactivateParentEntityFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doSetParentEntityId]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doSetParentEntityIdSuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doSetParentEntityIdFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateEntityTypes]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateEntityTypesSuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doUpdateEntityTypesFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doFetchEntityUsers]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetching = true;
    }),
    [actionCreators.doFetchEntityUsersSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.entityUsers = data.users;
    }),
    [actionCreators.doFetchEntityUsersFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doUpdateEntityPrefs]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doUpdateEntityPrefsSuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doUpdateEntityPrefsFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doDeactivateEntity]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doDeactivateEntitySuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doDeactivateEntityFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
    [actionCreators.doReactivateEntity]: produce((draft) => {
      draft.isSubmitting = true;
      draft.errorMessage = null;
    }),
    [actionCreators.doReactivateEntitySuccess]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doReactivateEntityFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.errorMessage = payload;
    }),
  },
  defaultState,
);

export default moduleReducer;
