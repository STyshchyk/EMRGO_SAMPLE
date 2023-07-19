import { call, put, takeLatest } from 'redux-saga/effects';

import * as admissionActionCreators from '../actionCreators/admission';
import * as admissionActionTypes from '../actionTypes/admission';
import * as wethaqAPIService from '../../services/wethaqAPIService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* submitIssuanceByIDForAdmission({ payload }) {
  try {
    const response = yield call(wethaqAPIService.admissionAPI.submitSukukByIDForAdmission, payload);
    const { data } = response;

    yield put(admissionActionCreators.doSubmitSukukForAdmissionSuccess({ data }));

    if (typeof payload?.successCallback === 'function') {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(admissionActionCreators.doSubmitSukukForAdmissionFailure(errorMessage));
  }
}

function* manageIssuanceByID({ payload }) {
  try {
    const response = yield call(wethaqAPIService.admissionAPI.manageSukukByID, payload);
    const { data } = response;

    yield put(admissionActionCreators.doManageSukukForAdmissionSuccess({ data }));

    if (typeof payload?.successCallback === 'function') {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(admissionActionCreators.doManageSukukForAdmissionFailure(errorMessage));
  }
}

const admissionSaga = [
  takeLatest(admissionActionTypes.SUBMIT_ISSUANCE_FOR_ADMISSION_REQUESTED, submitIssuanceByIDForAdmission),
  takeLatest(admissionActionTypes.MANAGE_ISSUANCE_REQUESTED, manageIssuanceByID),
];

export default admissionSaga;
