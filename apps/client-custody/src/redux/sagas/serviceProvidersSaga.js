import { call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import * as serviceProvidersActionCreators from '../actionCreators/serviceProviders';
import * as actionTypes from '../actionTypes/serviceProviders';
import * as wethaqAPIService from '../../services/wethaqAPIService';

import { extractErrorMessage, showToastErrorNotification } from '../helpers';

function* fetchServiceProviders({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.fetchServiceProviders, payload);
    yield put(serviceProvidersActionCreators.doFetchServiceProviderListSuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(serviceProvidersActionCreators.doFetchServiceProviderListFailure(errorMessage));
  }
}

function* engageServiceProvidersForLA({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.engageServiceProvidersForLA, payload);
    const { data } = response;
    yield put(serviceProvidersActionCreators.doFetchServiceProviderListRequest(payload));
    yield call(toast.success, data.message);
    yield put(serviceProvidersActionCreators.doEngageServiceProviderLASuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(serviceProvidersActionCreators.doEngageServiceProviderLASuccess(errorMessage));
  }
}

function* engageServiceProvidersForSP({ payload }) {
  try {
    const response = yield call(wethaqAPIService.engagementsAPI.engageServiceProvidersForSP, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(serviceProvidersActionCreators.doEngageServiceProviderSPSuccess(response));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(serviceProvidersActionCreators.doEngageServiceProviderSPSuccess(errorMessage));
  }
}

const serviceProvidersSaga = [
  takeLatest(actionTypes.SERVICE_PROVIDER_LIST_REQUESTED, fetchServiceProviders),
  takeLatest(actionTypes.SERVICE_PROVIDER_ENGAGE_LA_REQUESTED, engageServiceProvidersForLA),
  takeLatest(actionTypes.SERVICE_PROVIDER_ENGAGE_SP_REQUESTED, engageServiceProvidersForSP),
];

export default serviceProvidersSaga;
