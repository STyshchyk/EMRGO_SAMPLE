import { createSelector } from 'reselect';

export const selectAuthenticatedUserObject = (state) => state.auth?.authenticatedUserObject;
export const selectIsUserAuthenticated = (state) => state.auth?.isAuthenticated ?? false;
export const selectIsUserLoggingIn = (state) => state.auth?.isUserLoggingIn;
export const selectIsUserLoggingOut = (state) => state.auth?.isUserLoggingOut;
export const hasSuccessfullyRequestedPassword = (state) => state.auth?.hasSuccessfullyRequestedPassword;
export const selectResetEmailID = (state) => state.auth?.resetEmailID;
export const hasSuccessfullyResetPassword = (state) => state.auth?.hasSuccessfullyResetPassword;
export const selectUserId = (state) => state.auth?.authenticatedUserObject?.id;
export const selectUserEmail = (state) => state.auth?.authenticatedUserObject?.email;
export const selectFetchingUserData = (state) => state.auth?.isRequesting;
export const selectAuthMessage = (state) => state.auth?.message ?? '';
export const selectAuthErrorMessage = (state) => state.auth?.errorMessage;
export const selectIsRequesting = (state) => state.auth?.isRequesting;
export const selectAuthFailedObject = (state) => state.auth.authFailedObject;
export const selectAuthCredentials = (state) => state.auth.authCredentials;
export const selectHasSuccessfullyResetMFA = (state) => state.auth.hasSuccessfullyResetMFA;
export const selectMFAPath = (state) => state.auth.MFAPath;
export const hasMFAEnabled = (state) => state.auth?.authenticatedUserObject?.MFAEnabled ?? false;
export const hasMFAActive = (state) => state.auth?.authenticatedUserObject?.MFAActive ?? false;
export const hasMFAVerified = (state) => state.auth?.authenticatedUserObject?.isMFACodeVerified ?? false;
export const selectIsSessionTimeoutDialog = (state) => state.auth?.isSessionTimeoutDialog ?? false;
export const selectIsAccessDeniedDialog = (state) => state.auth?.isAccessDeniedDialog ?? false;
export const selectIsEntityTypeAdmin = (state) => state.auth.isEntityTypeAdmin;

export const selectUserFullName = createSelector([selectAuthenticatedUserObject], (authenticatedUserObject) => {
  if (authenticatedUserObject?.firstName && authenticatedUserObject?.lastName) {
    const { firstName, lastName } = authenticatedUserObject;

    if (authenticatedUserObject?.middleName) {
      const { middleName } = authenticatedUserObject;
      return `${firstName} ${middleName} ${lastName}`;
    }

    return `${firstName} ${lastName}`;
  }

  return '';
});

export const selectCurrentEntityGroupIndex = (state) => state.auth?.currentEntityGroupIndex;
export const selectOwnEntityGroups = (state) => state.auth?.authenticatedUserObject?.entityGroups;
export const selectCurrentEntityGroup = createSelector([selectOwnEntityGroups, selectCurrentEntityGroupIndex], (ownEntityGroups, currentEntityGroupIndex) => {
  if (ownEntityGroups?.length > 0) {
    return ownEntityGroups[currentEntityGroupIndex];
  }

  return null;
});

export const selectCurrentListOfAcls = createSelector([selectCurrentEntityGroup], (currentEntityGroup) => {
  if (Array.isArray(currentEntityGroup?.accessControls)) {
    return currentEntityGroup.accessControls.map(({ key }) => key);
  }

  return [];
});

export const selectOwnEntityGroupNames = createSelector([selectOwnEntityGroups], (ownEntityGroups) => {
  const names = [];

  if (ownEntityGroups) {
    ownEntityGroups.forEach((item, index) => {
      names.push({
        index,
        name: item?.name,
        type: item?.entityType,
      });
    });
  }

  return names;
});

export const selectOwnEntityNames = createSelector([selectOwnEntityGroups], (ownEntityGroups) => {
  const names = [];
  if (ownEntityGroups) {
    ownEntityGroups.forEach((item, index) => {
      names.push({
        index,
        name: item?.entity?.corporateEntityName,
        id: item?.entity?.id,
      });
    });
  }
  return names;
});

export const selectCurrentEntityType = createSelector([selectCurrentEntityGroup], (currentEntityGroup) => currentEntityGroup?.entityType);

export const selectCurrentCorporateEntityName = createSelector([selectCurrentEntityGroup], (currentEntityGroup) => currentEntityGroup?.entity?.corporateEntityName);

export const selectUserDisplayRole = createSelector([selectAuthenticatedUserObject], (authenticatedUserObject) => {
  if (authenticatedUserObject?.displayRole) {
    const { displayRole } = authenticatedUserObject;
    return displayRole;
  }

  return '';
});

export const selectUserEntity = (state) => state.auth?.authenticatedUserObject?.entity;
export const selectCorporateEntityName = createSelector([selectUserEntity], (userEntity) => userEntity?.corporateEntityName ?? '');

export const selectUserRole = (state) => state.auth?.authenticatedUserObject?.role;
