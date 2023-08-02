import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/admission";

export const doSubmitSukukForAdmission = createAction(
  actionTypes.SUBMIT_ISSUANCE_FOR_ADMISSION_REQUESTED
);
export const doSubmitSukukForAdmissionSuccess = createAction(
  actionTypes.SUBMIT_ISSUANCE_FOR_ADMISSION_SUCCEEDED
);
export const doSubmitSukukForAdmissionFailure = createAction(
  actionTypes.SUBMIT_ISSUANCE_FOR_ADMISSION_FAILED
);

export const doManageSukukForAdmission = createAction(actionTypes.MANAGE_ISSUANCE_REQUESTED);
export const doManageSukukForAdmissionSuccess = createAction(actionTypes.MANAGE_ISSUANCE_SUCCEEDED);
export const doManageSukukForAdmissionFailure = createAction(actionTypes.MANAGE_ISSUANCE_FAILED);
