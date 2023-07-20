import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as actionCreators from "../actionCreators/module";

const defaultState = {
  moduleDataLoading: false,
  isRequesting: false,
  moduleData: {},
  message: {},
};

const moduleReducer = handleActions(
  {
    [actionCreators.doFetchModuleData]: produce((draft) => {
      draft.moduleDataLoading = true;
    }),
    [actionCreators.doFetchModuleDataSuccess]: produce((draft, { payload: { data } }) => {
      draft.moduleData = data;
      draft.moduleDataLoading = false;
    }),
    [actionCreators.doFetchModuleDataFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.moduleDataLoading = false;
    }),

    [actionCreators.doAddModuleAccess]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doAddModuleAccessSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doAddModuleAccessFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),

    [actionCreators.doGrantModuleAccess]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doGrantModuleAccessSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doGrantModuleAccessFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),

    [actionCreators.doRevokeModuleAccess]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doRevokeModuleAccessSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doRevokeModuleAccessFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),

    [actionCreators.doRequestModuleAccess]: produce((draft) => {
      draft.isRequesting = true;
    }),
    [actionCreators.doRequestModuleAccessSuccess]: produce((draft) => {
      draft.isRequesting = false;
    }),
    [actionCreators.doRequestModuleAccessFailure]: produce((draft) => {
      draft.isRequesting = false;
    }),
  },
  defaultState
);

export default moduleReducer;
