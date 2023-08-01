export const selectValidListOfPreferences = (state) => state.preferences?.data?.preferences ?? [];
export const selectIsFetching = (state) => state.preferences.isFetching;
