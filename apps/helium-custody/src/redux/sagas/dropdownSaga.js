import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as dropdownActionCreators from "../actionCreators/dropdown";
import * as dropdownActionTypes from "../actionTypes/dropdown";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchDropdownOptions({ payload }) {
  try {
    const response = yield call(wethaqAPIService.dropdownAPI.getDropDownValues, payload);
    const { data } = response;

    yield put(dropdownActionCreators.doFetchDropdownOptionsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(dropdownActionCreators.doFetchDropdownOptionsFailure(errorMessage));
  }
}

const dropdownSaga = [
  takeLatest(dropdownActionTypes.FETCH_DROPDOWN_OPTIONS_REQUESTED, fetchDropdownOptions),
];

export default dropdownSaga;
