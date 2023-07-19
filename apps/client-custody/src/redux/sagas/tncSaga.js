import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import * as tncActionCreators from '../actionCreators/tnc';
import * as tncActionTypes from '../actionTypes/tnc';
import * as wethaqAPIService from '../../services/wethaqAPIService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchLatestTNCData({ payload }) {
  try {
    const response = yield call(wethaqAPIService.tncAPI.fetchTNCData, payload);
    const { data } = response;

    yield put(tncActionCreators.doFetchTermsDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(tncActionCreators.doFetchTermsDataFailure(errorMessage));
  }
}

function* fetchTNCStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.tncAPI.fetchTNCData, payload);
    const { data } = response;

    yield put(tncActionCreators.doFetchTermsStatusSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(tncActionCreators.doFetchTermsStatusFailure(errorMessage));
  }
}

function* acceptTNCVersion({ payload }) {
  try {
    const response = yield call(wethaqAPIService.tncAPI.acceptTNCVersion, payload);
    const { data } = response;

    if (data?.message) {
      yield call(toast.success, data.message, { autoClose: 5000 });
    }
    yield put(tncActionCreators.doAcceptTermsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(tncActionCreators.doAcceptTermsFailure(errorMessage));
  }
}

const tncSaga = [
  takeLatest(tncActionTypes.TNC_DATA_FETCH_REQUESTED, fetchLatestTNCData),
  takeLatest(tncActionTypes.TNC_STATUS_FETCH_REQUESTED, fetchTNCStatus),
  takeLatest(tncActionTypes.TNC_ACCEPTANCE_REQUESTED, acceptTNCVersion),
];

export default tncSaga;
