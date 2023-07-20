import { produce } from "immer";
import { handleActions } from "redux-actions";

import * as counterpartyActionCreators from "../actionCreators/counterparty";

const defaultState = {
  counterpartyList: [],
  counterparty: {},
  counterpartySSIList: [],
  counterpartySSI: {},
  errorMessage: null,
  isRequesting: false,
  isFetching: false,
  isFetchingDropdown: false,
  message: null,
  isLoading: false,
  dropdownData: {},
};

const counterpartyReducer = handleActions(
  {
    [counterpartyActionCreators.doFetchCounterpartyList]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [counterpartyActionCreators.doFetchCounterpartyListSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.isFetching = false;
        draft.counterpartyList = data;
      }
    ),
    [counterpartyActionCreators.doFetchCounterpartyListFailure]: produce((draft, { payload }) => {
      draft.isFetching = false;
      draft.errorMessage = payload;
    }),
    [counterpartyActionCreators.doAddCounterparty]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [counterpartyActionCreators.doAddCounterpartySuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [counterpartyActionCreators.doAddCounterpartyFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [counterpartyActionCreators.doEditCounterparty]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [counterpartyActionCreators.doEditCounterpartySuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [counterpartyActionCreators.doEditCounterpartyFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [counterpartyActionCreators.doDeleteCounterparty]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [counterpartyActionCreators.doDeleteCounterpartySuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [counterpartyActionCreators.doDeleteCounterpartyFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
    [counterpartyActionCreators.doFetchDropdowns]: produce((draft) => {
      draft.errorMessage = null;
      draft.isFetchingDropdown = true;
    }),
    [counterpartyActionCreators.doFetchDropdownsSuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.dropdownData = { ...data };
        draft.isFetchingDropdown = false;
      }
    ),
    [counterpartyActionCreators.doFetchDropdownsFailure]: produce((draft, { payload }) => {
      draft.message = payload;
      draft.isFetchingDropdown = false;
      draft.errorMessage = payload;
    }),
    [counterpartyActionCreators.doFetchCounterpartySSIList]: produce((draft) => {
      draft.isFetching = true;
      draft.errorMessage = null;
    }),
    [counterpartyActionCreators.doFetchCounterpartySSIListSuccess]: produce(
      (
        draft,
        {
          payload: {
            data: { data },
          },
        }
      ) => {
        draft.isFetching = false;
        draft.counterpartySSIList = data;
      }
    ),
    [counterpartyActionCreators.doFetchCounterpartySSIListFailure]: produce(
      (draft, { payload }) => {
        draft.isFetching = false;
        draft.errorMessage = payload;
      }
    ),
    [counterpartyActionCreators.doAddCounterpartySSI]: produce((draft) => {
      draft.isRequesting = true;
      draft.errorMessage = null;
    }),
    [counterpartyActionCreators.doAddCounterpartySSISuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [counterpartyActionCreators.doAddCounterpartySSIFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [counterpartyActionCreators.doEditCounterpartySSI]: produce((draft) => {
      draft.message = null;
      draft.errorMessage = null;
      draft.isRequesting = true;
    }),
    [counterpartyActionCreators.doEditCounterpartySSISuccess]: produce(
      (draft, { payload: { data } }) => {
        draft.isRequesting = false;
        draft.message = data;
      }
    ),
    [counterpartyActionCreators.doEditCounterpartySSIFailure]: produce((draft, { payload }) => {
      draft.isRequesting = false;
      draft.errorMessage = payload;
    }),
    [counterpartyActionCreators.doDeleteCounterpartySSI]: produce((draft) => {
      draft.isLoading = true;
      draft.errorMessage = null;
    }),
    [counterpartyActionCreators.doDeleteCounterpartySSISuccess]: produce((draft) => {
      draft.isLoading = false;
    }),
    [counterpartyActionCreators.doDeleteCounterpartySSIFailure]: produce((draft, { message }) => {
      draft.isLoading = false;
      draft.errorMessage = message;
    }),
  },
  defaultState
);

export default counterpartyReducer;
