import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as accessControlsActionCreators from "../actionCreators/accessControls";
import * as accessControlsActionTypes from "../actionTypes/accessControls";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchAccessControlsSaga({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.accessControlsAPI.getListOfValidAccessControls,
      payload
    );
    const { data } = response;

    yield put(accessControlsActionCreators.doFetchAccessControlsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(accessControlsActionCreators.doFetchAccessControlsFailure(errorMessage));
  }
}

const accessControlsSaga = [
  takeLatest(accessControlsActionTypes.ACCESS_CONTROLS_FETCH_REQUESTED, fetchAccessControlsSaga),
];

export default accessControlsSaga;
