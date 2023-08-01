import { toast } from "react-toastify";

import { call, put, takeLatest } from "redux-saga/effects";

import * as wethaqAPIService from "../../services/wethaqAPIService";
import * as entitiesActionCreators from "../actionCreators/entities";
import * as onboardingActionCreators from "../actionCreators/onboarding";
import * as usersActionCreators from "../actionCreators/users";
import * as usersActionTypes from "../actionTypes/users";
import { extractErrorMessage, showToastErrorNotification } from "../helpers";

function* updateUserAccountStatus({ payload }) {
  try {
    const response = yield call(wethaqAPIService.userAPI.updateUserAccountStatus, payload);
    const { data } = response;
    yield call(toast.success, data.message);
    yield put(usersActionCreators.doUpdateUserAccountStatusSuccess({ data }));
    if (payload.refresh) {
      switch (payload?.refresh?.type) {
        case "entityUsers":
          yield put(entitiesActionCreators.doFetchEntityUsers(payload?.refresh?.params));
          break;
        default:
          break;
      }
    } else {
      yield put(
        onboardingActionCreators.doFetchRMVisitorsRequest({ verified: payload?.verified ?? false })
      );
    }
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    showToastErrorNotification(error, errorMessage);
    yield put(usersActionCreators.doUpdateUserAccountStatusFailure(errorMessage));
  }
}

const usersSaga = [
  takeLatest(usersActionTypes.UPDATE_USER_ACCOUNT_STATUS_REQUESTED, updateUserAccountStatus),
];

export default usersSaga;
