export const selectEntities = (state) => state.entities?.entitiesList ?? [];
export const selectEntityUsers = (state) => state.entities.entityUsers;
export const selectIsFetching = (state) => state.entities.isFetching;
export const selectIsFetchingEntities = (state) => state.entities.isLoading;
export const selectIsSubmitting = (state) => state.entities.isSubmitting;
export const selectParentEntities = (state) => state.entities?.parentEntities?.entityParents ?? [];
