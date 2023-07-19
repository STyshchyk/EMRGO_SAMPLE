import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/serviceProviders';

const defaultState = {
  serviceProviderData: {},
  isFetching: false,
  isSubmitting: false,
  message: {}
};

const engagementReducer = handleActions(
  {
    [actionCreators.doFetchServiceProviderListRequest]: produce((draft) => {
      draft.isFetching = true;
    }),

    [actionCreators.doEngageServiceProviderLARequest]: produce((draft) => {
      draft.isSubmitting = true;
    }),
    [actionCreators.doEngageServiceProviderSPRequest]: produce((draft) => {
      draft.isSubmitting = true;
    }),
    [actionCreators.doFetchServiceProviderListSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.serviceProviderData = data;
    }),
    [actionCreators.doEngageServiceProviderLASuccess]: produce((draft, { payload: { message } }) => {
      draft.isSubmitting = false;
      draft.message = message;
    }),
    [actionCreators.doEngageServiceProviderSPSuccess]: produce((draft, { payload: { message } }) => {
      draft.isSubmitting = false;
      draft.message = message;
    }),
    [actionCreators.doFetchServiceProviderListFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.message = payload;
    }),
    [actionCreators.doEngageServiceProviderLAFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    }),
    [actionCreators.doEngageServiceProviderSPFailure]: produce((draft, { payload }) => {
      draft.isSubmitting = false;
      draft.message = payload;
    })
  },
  defaultState
);

export default engagementReducer;
