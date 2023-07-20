import { createSelector } from "reselect";

export const selectAccessControlsData = (state) => state.accessControls.data;
export const selectIsFetching = (state) => state.accessControls.isFetching;
export const selectErrorMessage = (state) => state.accessControls.errorMessage;

export const selectListOfValidACLNames = createSelector(
  [selectAccessControlsData],
  (accessControlsData) => {
    if (accessControlsData?.accessControls) {
      const accessControls = accessControlsData?.accessControls;

      return accessControls
        .filter((acl) => acl.isActive)
        .map((activeAcl) => ({
          displayName: activeAcl.displayName,
          key: activeAcl.key,
        }))
        .sort((a, b) => (a.key > b.key ? 1 : -1));
    }

    return [];
  }
);

export const selectListOfACLKeys = createSelector(
  [selectAccessControlsData],
  (accessControlsData) => {
    if (accessControlsData?.accessControls) {
      const accessControls = accessControlsData?.accessControls;

      return accessControls.filter((acl) => acl.isActive).map((activeAcl) => activeAcl.key);
    }

    return [];
  }
);
