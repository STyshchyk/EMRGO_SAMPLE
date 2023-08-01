import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as authActionCreators from "../actionCreators/auth";
import * as entityActionCreators from "../actionCreators/entities";
import * as moduleActionCreators from "../actionCreators/module";
import * as actionTypes from "../actionTypes/module";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchModuleData() {
  try {
    const response = yield call(wethaqAPIService.modulesAPI.getModuleData);
    const { data } = response;
    yield put(moduleActionCreators.doFetchModuleDataSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(moduleActionCreators.doFetchModuleDataFailure(errorMessage));
  }
}

function* addModuleAccess({ payload }) {
  try {
    const response = yield call(wethaqAPIService.modulesAPI.addModuleAccess, payload);
    const { data } = response;
    yield put(moduleActionCreators.doAddModuleAccessSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(authActionCreators.doUpdateUserPermissions({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(moduleActionCreators.doAddModuleAccessFailure(errorMessage));
  }
}

function* grantModuleAccess({ payload }) {
  try {
    const response = yield call(wethaqAPIService.modulesAPI.grantModuleAccess, payload);
    const { data } = response;
    yield put(moduleActionCreators.doAddModuleAccessSuccess({ data }));
    yield call(toast.success, data.message);
    yield put(entityActionCreators.doFetchEntityUsers({ id: payload.entityID }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(moduleActionCreators.doAddModuleAccessFailure(errorMessage));
  }
}

function* revokeModuleAccess({ payload }) {
  try {
    const response = yield call(wethaqAPIService.modulesAPI.revokeModuleAccess, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(moduleActionCreators.doAddModuleAccessSuccess({ data }));
    yield put(entityActionCreators.doFetchEntityUsers({ id: payload.entityID }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(moduleActionCreators.doAddModuleAccessFailure(errorMessage));
  }
}

function* requestModuleAccess({ payload }) {
  try {
    const response = yield call(wethaqAPIService.modulesAPI.requestModuleAccess, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(moduleActionCreators.doRequestModuleAccessSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(moduleActionCreators.doRequestModuleAccessFailure(errorMessage));
  }
}

const moduleSaga = [
  takeLatest(actionTypes.MODULE_FETCH_DATA_REQUESTED, fetchModuleData),
  takeLatest(actionTypes.ADD_MODULE_ACCESS_REQUESTED, addModuleAccess),
  takeLatest(actionTypes.GRANT_MODULE_ACCESS_REQUESTED, grantModuleAccess),
  takeLatest(actionTypes.REVOKE_MODULE_ACCESS_REQUESTED, revokeModuleAccess),
  takeLatest(actionTypes.REQUEST_MODULE_ACCESS_REQUESTED, requestModuleAccess),
];

export default moduleSaga;
