import { handleActions } from 'redux-actions';
import produce from 'immer';

import * as actionCreators from '../actionCreators/messaging';

const defaultState = {
  messagesData: {},
  isFetching: true,
  isSubmitting: false,
  isMessageSocketOpen: false
};

const messagingReducer = handleActions(
  {
    [actionCreators.doFetchMessagesRequest]: produce((draft) => {
      draft.isFetching = true;
    }),
    [actionCreators.doSubmitMessagesRequest]: produce((draft) => {
      draft.isSubmitting = true;
    }),
    [actionCreators.doFetchMessagesSuccess]: produce((draft, { payload: { data } }) => {
      draft.isFetching = false;
      draft.messagesData = data;
    }),
    [actionCreators.doSubmitMessagesSuccess]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doSubmitMessagesFailure]: produce((draft) => {
      draft.isSubmitting = false;
    }),
    [actionCreators.doFetchMessagesFailure]: produce((draft) => {
      draft.isFetching = false;
    }),
    [actionCreators.doOpenMessageSocketRequest]: produce((draft) => {
      draft.isMessageSocketOpen = true;
    }),
    [actionCreators.doOpenMessageSocketSuccess]: produce((draft, { payload }) => {
      draft.isMessageSocketOpen = true;
      draft.messagesData.messages.push(payload);
    }),
    [actionCreators.doOpenMessageSocketFailure]: produce((draft) => {
      draft.isMessageSocketOpen = false;
    })
  },
  defaultState
);

export default messagingReducer;
