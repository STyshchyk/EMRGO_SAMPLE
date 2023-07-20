import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/serviceProviders";

export const doFetchServiceProviderListRequest = createAction(
  actionTypes.SERVICE_PROVIDER_LIST_REQUESTED
);
export const doFetchServiceProviderListSuccess = createAction(
  actionTypes.SERVICE_PROVIDER_LIST_SUCCEEDED
);
export const doFetchServiceProviderListFailure = createAction(
  actionTypes.SERVICE_PROVIDER_LIST_FAILED
);

export const doEngageServiceProviderLARequest = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGE_LA_REQUESTED
);
export const doEngageServiceProviderLASuccess = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGE_LA_SUCCEEDED
);
export const doEngageServiceProviderLAFailure = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGE_LA_FAILED
);

export const doEngageServiceProviderSPRequest = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGE_SP_REQUESTED
);
export const doEngageServiceProviderSPSuccess = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGE_SP_SUCCEEDED
);
export const doEngageServiceProviderSPFailure = createAction(
  actionTypes.SERVICE_PROVIDER_ENGAGE_SP_FAILED
);
