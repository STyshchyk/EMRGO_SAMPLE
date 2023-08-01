import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import i18n from "../../i18n";
import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as authActionCreators from "../actionCreators/auth";
import * as entityGroupsActionCreators from "../actionCreators/entityGroups";
import * as kycActionCreators from "../actionCreators/kyc";
import * as actionTypes from "../actionTypes/entityGroups";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* fetchEntityGroups({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entitiesAPI.getEntityGroupsByEntityID, payload);
    const { data } = response;
    yield put(entityGroupsActionCreators.doFetchEntityGroupsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entityGroupsActionCreators.doFetchEntityGroupsFailure(errorMessage));
  }
}

function* fetchEntityGroupDetails({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.entityGroupsAPI.getEntityGroupDetailsByGroupID,
      payload
    );
    const { data } = response;

    yield put(entityGroupsActionCreators.doFetchEntityGroupDetailsSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entityGroupsActionCreators.doFetchEntityGroupDetailsFailure(errorMessage));
  }
}

function* updateEntityGroupUserACL({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.entityGroupsAPI.updateEntityGroupUserACLByUserID,
      payload
    );
    const { data } = response;
    yield call(
      toast.success,
      data?.message ?? i18n.t("messages:Success is not final failure is not fatal")
    );
    yield put(entityGroupsActionCreators.doRequestEntityGroupUserEditSuccess({ data }));
    yield put(entityGroupsActionCreators.doFetchEntityGroupDetails({ id: payload.groupId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entityGroupsActionCreators.doRequestEntityGroupUserEditFailure(errorMessage));
  }
}

function* addEntityGroup({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entityGroupsAPI.addEntityGroup, payload);
    const { data } = response;
    yield call(toast.success, data.message);

    yield put(entityGroupsActionCreators.doAddEntityGroupSuccess({ data }));
    yield put(
      entityGroupsActionCreators.doFetchEntityGroups({ entityId: payload.requestPayload.entityId })
    );
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entityGroupsActionCreators.doAddEntityGroupFailure(errorMessage));
  }
}

function* attachEntityUserToEntityGroup({ payload }) {
  try {
    const response = yield call(
      wethaqAPIService.entityGroupsAPI.attachEntityUserToEntityGroup,
      payload
    );
    const { data } = response;
    yield call(toast.success, data.message);

    yield put(entityGroupsActionCreators.doAttachEntityUserToEntityGroupSuccess({ data }));
    yield put(entityGroupsActionCreators.doFetchEntityGroupDetails({ id: payload.entityGroupId }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entityGroupsActionCreators.doAttachEntityUserToEntityGroupFailure(errorMessage));
  }
}

function* requestAgreementSaga({ payload }) {
  try {
    const response = yield call(wethaqAPIService.entityGroupsAPI.requestAgreement, payload);
    const { data } = response;
    yield put(entityGroupsActionCreators.doFetchEntityGroups({ entityId: payload.entityId }));
    yield put(
      kycActionCreators.doFetchKYCData({
        entityId: payload.entityId,
        requestPayload: {
          includeSignedUrl: false,
        },
      })
    );
    yield put(authActionCreators.doFetchCurrentUserData());
    yield put(entityGroupsActionCreators.doRequestAgreementSuccess({ data }));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(entityGroupsActionCreators.doRequestAgreementFailure(errorMessage));
  }
}

const entitiesSaga = [
  takeLatest(actionTypes.ENTITY_GROUPS_REQUESTED, fetchEntityGroups),
  takeLatest(actionTypes.ENTITY_GROUP_DETAILS_REQUESTED, fetchEntityGroupDetails),
  takeLatest(actionTypes.ENTITY_GROUP_USER_ACL_EDIT_REQUESTED, updateEntityGroupUserACL),
  takeLatest(actionTypes.ADD_ENTITY_GROUP_REQUESTED, addEntityGroup),
  takeLatest(
    actionTypes.ATTACH_ENTITY_USER_TO_ENTITY_GROUP_REQUESTED,
    attachEntityUserToEntityGroup
  ),
  takeLatest(actionTypes.REQUEST_AGREEMENT_REQUESTED, requestAgreementSaga),
];

export default entitiesSaga;
