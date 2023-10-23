import { createSelector } from "reselect";

export const selectEntities = (state) => state.entities?.entitiesList ?? [];
export const selectEmrgoEntities = (state) => state.entities?.emrgoEntities ?? [];
export const selectLegacyEntities = (state) => state.entities?.legacyEntitiesList ?? [];
export const selectEntityUsers = (state) => state.entities.entityUsers;
export const selectIsFetching = (state) => state.entities.isFetching;
export const selectIsFetchingEntities = (state) => state.entities.isLoading;
export const selectIsSubmitting = (state) => state.entities.isSubmitting;
export const selectParentEntities = (state) => state.entities?.parentEntities?.entityParents ?? [];


export const selectAllEntities = createSelector(
  [selectEntities, selectEmrgoEntities],
  (entities, emrgoEntities) => [...emrgoEntities, ...entities]
);
