import { createAction } from "redux-actions";

import * as actionTypes from "../actionTypes/entities";

export const doFetchEntities = createAction(actionTypes.ENTITIES_REQUESTED);
export const doFetchEntitiesSuccess = createAction(actionTypes.ENTITIES_SUCCEEDED);
export const doFetchEntitiesFailure = createAction(actionTypes.ENTITIES_FAILED);

export const doFetchLegacyEntities = createAction(actionTypes.LEGACY_ENTITIES_REQUESTED);
export const doFetchLegacyEntitiesSuccess = createAction(actionTypes.LEGACY_ENTITIES_SUCCEEDED);
export const doFetchLegacyEntitiesFailure = createAction(actionTypes.LEGACY_ENTITIES_FAILED);

export const doFetchEntityUsers = createAction(actionTypes.ENTITY_USERS_REQUESTED);
export const doFetchEntityUsersSuccess = createAction(actionTypes.ENTITY_USERS_SUCCEEDED);
export const doFetchEntityUsersFailure = createAction(actionTypes.ENTITY_USERS_FAILED);

export const doFetchParentEntities = createAction(actionTypes.FETCH_PARENT_ENTITIES_REQUESTED);
export const doFetchParentEntitiesSuccess = createAction(
  actionTypes.FETCH_PARENT_ENTITIES_SUCCEEDED
);
export const doFetchParentEntitiesFailure = createAction(actionTypes.FETCH_PARENT_ENTITIES_FAILED);

export const doAddParentEntity = createAction(actionTypes.ADD_PARENT_ENTITY_REQUESTED);
export const doAddParentEntitySuccess = createAction(actionTypes.ADD_PARENT_ENTITY_SUCCEEDED);
export const doAddParentEntityFailure = createAction(actionTypes.ADD_PARENT_ENTITY_FAILED);

export const doUpdateParentEntity = createAction(actionTypes.UPDATE_PARENT_ENTITY_REQUESTED);
export const doUpdateParentEntitySuccess = createAction(actionTypes.UPDATE_PARENT_ENTITY_SUCCEEDED);
export const doUpdateParentEntityFailure = createAction(actionTypes.UPDATE_PARENT_ENTITY_FAILED);

export const doDeactivateParentEntity = createAction(
  actionTypes.DEACTIVATE_PARENT_ENTITY_REQUESTED
);
export const doDeactivateParentEntitySuccess = createAction(
  actionTypes.DEACTIVATE_PARENT_ENTITY_SUCCEEDED
);
export const doDeactivateParentEntityFailure = createAction(
  actionTypes.DEACTIVATE_PARENT_ENTITY_FAILED
);

export const doSetParentEntityId = createAction(actionTypes.SET_PARENT_ENTITY_ID_REQUESTED);
export const doSetParentEntityIdSuccess = createAction(actionTypes.SET_PARENT_ENTITY_ID_SUCCEEDED);
export const doSetParentEntityIdFailure = createAction(actionTypes.SET_PARENT_ENTITY_ID_FAILED);

export const doUpdateEntityTypes = createAction(actionTypes.UPDATE_ENTITY_TYPES_REQUESTED);
export const doUpdateEntityTypesSuccess = createAction(actionTypes.UPDATE_ENTITY_TYPES_SUCCEEDED);
export const doUpdateEntityTypesFailure = createAction(actionTypes.UPDATE_ENTITY_TYPES_FAILED);

export const doUpdateEntityPrefs = createAction(actionTypes.UPDATE_ENTITY_PREFS_REQUESTED);
export const doUpdateEntityPrefsSuccess = createAction(actionTypes.UPDATE_ENTITY_PREFS_SUCCEEDED);
export const doUpdateEntityPrefsFailure = createAction(actionTypes.UPDATE_ENTITY_PREFS_FAILED);

export const doDeactivateEntity = createAction(actionTypes.DEACTIVATE_ENTITY_REQUESTED);
export const doDeactivateEntitySuccess = createAction(actionTypes.DEACTIVATE_ENTITY_SUCCEEDED);
export const doDeactivateEntityFailure = createAction(actionTypes.DEACTIVATE_ENTITY_FAILED);

export const doReactivateEntity = createAction(actionTypes.REACTIVATE_ENTITY_REQUESTED);
export const doReactivateEntitySuccess = createAction(actionTypes.REACTIVATE_ENTITY_SUCCEEDED);
export const doReactivateEntityFailure = createAction(actionTypes.REACTIVATE_ENTITY_FAILED);

export const doEditEntityCustodySettings = createAction(
  actionTypes.ENTITY_EDIT_CUSTODY_SETTINGS_REQUESTED
);
export const doEditEntityCustodySettingsSuccess = createAction(
  actionTypes.ENTITY_EDIT_CUSTODY_SETTINGS_SUCCEEDED
);
export const doEditEntityCustodySettingsFailure = createAction(
  actionTypes.ENTITY_EDIT_CUSTODY_SETTINGS_FAILED
);
