import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as entitiesActionCreators from "../actionCreators/entities";
import * as actionTypes from "../actionTypes/entities";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchEntitiesSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.getEntities, payload);
    const { data } = response;
    yield put(entitiesActionCreators.doFetchEntitiesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doFetchEntitiesFailure(errorMessage));
  }
}

function* fetchEmrgoEntitiesSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.getEmrgoEntities, payload);
    const { data } = response;
    yield put(entitiesActionCreators.doFetchEmrgoEntitiesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doFetchEmrgoEntitiesFailure(errorMessage));
  }
}


function* fetchLegacyEntitiesSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.getLegacyEntities, payload);
    const { data } = response;
    yield put(entitiesActionCreators.doFetchLegacyEntitiesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doFetchLegacyEntitiesFailure(errorMessage));
  }
}

function* fetchEntityUsersSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.getUsersByEntityID, payload);
    const { data } = response;
    yield put(entitiesActionCreators.doFetchEntityUsersSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doFetchEntityUsersFailure(errorMessage));
  }
}

function* fetchParentEntitiesSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.getParentEntities, payload);
    const { data } = response;
    yield put(entitiesActionCreators.doFetchParentEntitiesSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doFetchParentEntitiesFailure(errorMessage));
  }
}

function* addParentEntity({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.addParentEntity, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doAddParentEntitySuccess({ data }));
    yield put(entitiesActionCreators.doFetchParentEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doAddParentEntityFailure(errorMessage));
  }
}

function* editParentEntity({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.updateParentEntity, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doUpdateParentEntitySuccess({ data }));
    yield put(entitiesActionCreators.doFetchParentEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doUpdateParentEntityFailure(errorMessage));
  }
}

function* deactivateParentEntity({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.deactivateParentEntity, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doDeactivateParentEntitySuccess({ data }));
    yield put(entitiesActionCreators.doFetchParentEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doDeactivateParentEntityFailure(errorMessage));
  }
}

function* updateEntityTypes({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.updateEntityTypes, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doUpdateEntityTypesSuccess({ data }));
    yield put(entitiesActionCreators.doFetchEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doUpdateEntityTypesFailure(errorMessage));
  }
}

function* setParentEntity({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.setParentEntityID, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doSetParentEntityIdSuccess({ data }));
    yield put(entitiesActionCreators.doFetchEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doSetParentEntityIdFailure(errorMessage));
  }
}

function* updateEntityPrefs({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.updateEntityPrefs, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doUpdateEntityPrefsSuccess({ data }));
    yield put(entitiesActionCreators.doFetchEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doUpdateEntityPrefsFailure(errorMessage));
  }
}

function* deactivateEntity({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.deactivateEntity, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doDeactivateEntitySuccess({ data }));
    yield put(entitiesActionCreators.doFetchEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doDeactivateEntityFailure(errorMessage));
  }
}

function* reactivateEntity({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.reactivateEntity, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doReactivateEntitySuccess({ data }));
    yield put(entitiesActionCreators.doFetchEntities());
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doReactivateEntityFailure(errorMessage));
  }
}

function* editEntityCustodySetting({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.editEntityCustodySettings, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(entitiesActionCreators.doEditEntityCustodySettingsSuccess({ data }));

    if (typeof payload?.successCallback === "function") {
      payload.successCallback();
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entitiesActionCreators.doEditEntityCustodySettingsFailure(errorMessage));
  }
}

const entitiesSaga = [
  takeLatest(actionTypes.ENTITIES_REQUESTED, fetchEntitiesSaga),
  takeLatest(actionTypes.EMRGO_ENTITIES_REQUESTED, fetchEmrgoEntitiesSaga),
  takeLatest(actionTypes.LEGACY_ENTITIES_REQUESTED, fetchLegacyEntitiesSaga),
  takeLatest(actionTypes.ENTITY_USERS_REQUESTED, fetchEntityUsersSaga),
  takeLatest(actionTypes.FETCH_PARENT_ENTITIES_REQUESTED, fetchParentEntitiesSaga),
  takeLatest(actionTypes.ADD_PARENT_ENTITY_REQUESTED, addParentEntity),
  takeLatest(actionTypes.UPDATE_PARENT_ENTITY_REQUESTED, editParentEntity),
  takeLatest(actionTypes.DEACTIVATE_PARENT_ENTITY_REQUESTED, deactivateParentEntity),
  takeLatest(actionTypes.UPDATE_ENTITY_TYPES_REQUESTED, updateEntityTypes),
  takeLatest(actionTypes.SET_PARENT_ENTITY_ID_REQUESTED, setParentEntity),
  takeLatest(actionTypes.UPDATE_ENTITY_PREFS_REQUESTED, updateEntityPrefs),
  takeLatest(actionTypes.DEACTIVATE_ENTITY_REQUESTED, deactivateEntity),
  takeLatest(actionTypes.REACTIVATE_ENTITY_REQUESTED, reactivateEntity),
  takeLatest(actionTypes.ENTITY_EDIT_CUSTODY_SETTINGS_REQUESTED, editEntityCustodySetting),
];

export default entitiesSaga;
