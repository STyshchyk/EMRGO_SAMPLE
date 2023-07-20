import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as preferencesActionCreators from "../actionCreators/preferences";
import * as actionTypes from "../actionTypes/preferences";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchListOfValidPreferences() {
  try {
    const response = yield call(wethaqAPIService.preferencesAPI.getListOfValidPreferences);
    const { data } = response;
    yield put(preferencesActionCreators.doFetchPreferencesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(preferencesActionCreators.doFetchPreferencesFailure(errorMessage));
  }
}

const preferencesSaga = [
  takeLatest(actionTypes.PREFERENCES_FETCH_REQUESTED, fetchListOfValidPreferences),
];

export default preferencesSaga;
