import { createAction } from 'redux-actions';

import * as actionTypes from '../actionTypes/entityGroups';

export const doFetchEntityGroups = createAction(actionTypes.ENTITY_GROUPS_REQUESTED);
export const doFetchEntityGroupsSuccess = createAction(actionTypes.ENTITY_GROUPS_SUCCEEDED);
export const doFetchEntityGroupsFailure = createAction(actionTypes.ENTITY_GROUPS_FAILED);

export const doFetchEntityGroupDetails = createAction(actionTypes.ENTITY_GROUP_DETAILS_REQUESTED);
export const doFetchEntityGroupDetailsSuccess = createAction(actionTypes.ENTITY_GROUP_DETAILS_SUCCEEDED);
export const doFetchEntityGroupDetailsFailure = createAction(actionTypes.ENTITY_GROUP_DETAILS_FAILED);

export const doRequestEntityGroupUserEdit = createAction(actionTypes.ENTITY_GROUP_USER_ACL_EDIT_REQUESTED);
export const doRequestEntityGroupUserEditSuccess = createAction(actionTypes.ENTITY_GROUP_USER_ACL_EDIT_SUCCEEDED);
export const doRequestEntityGroupUserEditFailure = createAction(actionTypes.ENTITY_GROUP_USER_ACL_EDIT_FAILED);

export const doAddEntityGroup = createAction(actionTypes.ADD_ENTITY_GROUP_REQUESTED);
export const doAddEntityGroupSuccess = createAction(actionTypes.ADD_ENTITY_GROUP_SUCCEEDED);
export const doAddEntityGroupFailure = createAction(actionTypes.ADD_ENTITY_GROUP_FAILED);

export const doAttachEntityUserToEntityGroup = createAction(actionTypes.ATTACH_ENTITY_USER_TO_ENTITY_GROUP_REQUESTED);
export const doAttachEntityUserToEntityGroupSuccess = createAction(actionTypes.ATTACH_ENTITY_USER_TO_ENTITY_GROUP_SUCCEEDED);
export const doAttachEntityUserToEntityGroupFailure = createAction(actionTypes.ATTACH_ENTITY_USER_TO_ENTITY_GROUP_FAILED);

export const doRequestAgreement = createAction(actionTypes.REQUEST_AGREEMENT_REQUESTED);
export const doRequestAgreementSuccess = createAction(actionTypes.REQUEST_AGREEMENT_SUCCEEDED);
export const doRequestAgreementFailure = createAction(actionTypes.REQUEST_AGREEMENT_FAILED);
