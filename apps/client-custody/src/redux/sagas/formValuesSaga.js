import { call, put, takeLatest } from 'redux-saga/effects';

import * as formActionCreators from '../actionCreators/form';
import * as formActionTypes from '../actionTypes/form';
import * as wethaqAPIService from '../../services/wethaqAPIService';
import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchFormValues({ payload }) {
  try {
    const response = yield call(wethaqAPIService.formManageAPI.fetchValues, payload);
    const { data } = response;
    yield put(formActionCreators.doFetchFormSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(formActionCreators.doFetchFormFailure(errorMessage));
  }
}
function* postFormValues({ payload }) {
  try {
    const response = yield call(wethaqAPIService.formManageAPI.postValues, payload);
    const { data } = response;
    yield put(formActionCreators.doPostFormSuccess(payload));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(formActionCreators.doFetchFormFailure(errorMessage));
  }
}

const formSaga = [takeLatest(formActionTypes.FETCH_FORM_REQUESTED, fetchFormValues), takeLatest(formActionTypes.POST_FORM_REQUESTED, postFormValues)];

export default formSaga;
