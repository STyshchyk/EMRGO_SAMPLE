import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/counterparty';

export const doFetchCounterpartyList = createAction(actionTypes.COUNTERPARTY_LIST_FETCH_REQUESTED);
export const doFetchCounterpartyListSuccess = createAction(actionTypes.COUNTERPARTY_LIST_FETCH_SUCCEEDED);
export const doFetchCounterpartyListFailure = createAction(actionTypes.COUNTERPARTY_LIST_FETCH_FAILED);

export const doAddCounterparty = createAction(actionTypes.COUNTERPARTY_ADD_REQUESTED);
export const doAddCounterpartySuccess = createAction(actionTypes.COUNTERPARTY_ADD_SUCCEEDED);
export const doAddCounterpartyFailure = createAction(actionTypes.COUNTERPARTY_ADD_FAILED);

export const doEditCounterparty = createAction(actionTypes.COUNTERPARTY_EDIT_REQUESTED);
export const doEditCounterpartySuccess = createAction(actionTypes.COUNTERPARTY_EDIT_SUCCEEDED);
export const doEditCounterpartyFailure = createAction(actionTypes.COUNTERPARTY_EDIT_FAILED);

export const doDeleteCounterparty = createAction(actionTypes.COUNTERPARTY_DELETE_REQUESTED);
export const doDeleteCounterpartySuccess = createAction(actionTypes.COUNTERPARTY_DELETE_SUCCEEDED);
export const doDeleteCounterpartyFailure = createAction(actionTypes.COUNTERPARTY_DELETE_FAILED);

export const doFetchDropdowns = createAction(actionTypes.FETCH_DROPDOWNS);
export const doFetchDropdownsSuccess = createAction(actionTypes.FETCH_DROPDOWNS_SUCCEEDED);
export const doFetchDropdownsFailure = createAction(actionTypes.FETCH_DROPDOWNS_FAILED);

export const doFetchCounterpartySSIList = createAction(actionTypes.COUNTERPARTY_SSI_LIST_FETCH_REQUESTED);
export const doFetchCounterpartySSIListSuccess = createAction(actionTypes.COUNTERPARTY_SSI_LIST_FETCH_SUCCEEDED);
export const doFetchCounterpartySSIListFailure = createAction(actionTypes.COUNTERPARTY_SSI_LIST_FETCH_FAILED);

export const doAddCounterpartySSI = createAction(actionTypes.COUNTERPARTY_SSI_ADD_REQUESTED);
export const doAddCounterpartySSISuccess = createAction(actionTypes.COUNTERPARTY_SSI_ADD_SUCCEEDED);
export const doAddCounterpartySSIFailure = createAction(actionTypes.COUNTERPARTY_SSI_ADD_FAILED);

export const doEditCounterpartySSI = createAction(actionTypes.COUNTERPARTY_SSI_EDIT_REQUESTED);
export const doEditCounterpartySSISuccess = createAction(actionTypes.COUNTERPARTY_SSI_EDIT_SUCCEEDED);
export const doEditCounterpartySSIFailure = createAction(actionTypes.COUNTERPARTY_SSI_EDIT_FAILED);

export const doDeleteCounterpartySSI = createAction(actionTypes.COUNTERPARTY_SSI_DELETE_REQUESTED);
export const doDeleteCounterpartySSISuccess = createAction(actionTypes.COUNTERPARTY_SSI_DELETE_SUCCEEDED);
export const doDeleteCounterpartySSIFailure = createAction(actionTypes.COUNTERPARTY_SSI_DELETE_FAILED);
