import localForage from 'localforage';

const asyncDataStore = localForage.createInstance({
  name: 'Wethaq Portal App',
  storeName: 'wethaq_portal_app',
});

export const clearAsyncDataStore = async () => {
  await asyncDataStore.clear();
  window.location.reload();
};

export default asyncDataStore;
