import { silverAuthenticationRoutes } from "@emrgo-frontend/constants";
import { navigateSilverModule, silverModule } from "@emrgo-frontend/utils";
import localForage from "localforage";

const asyncDataStore = localForage.createInstance({
  name: "Wethaq Portal App",
  storeName: "wethaq_portal_app",
});

export const clearAsyncDataStore = async () => {
  await asyncDataStore.clear();
  navigateSilverModule(silverModule.authentication, silverAuthenticationRoutes.login);
};

export default asyncDataStore;
