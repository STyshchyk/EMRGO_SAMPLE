import useDeepCompareEffect from "use-deep-compare-effect";

import appConfig from "../appConfig";
import { baseAxiosInstance } from "../services/wethaqAPIService/helpers";

/**
 * useWethaqAPIParams custom hook registers an Axios interceptor that handles adding user provided query params to Wethaq API requests on mount
 * The interceptor intercepts only Wethaq API requests that are triggered by the component that uses this hook
 */
const useWethaqAPIParams = (queryParams) => {
  useDeepCompareEffect(() => {
    // console.debug('DEBUG useWethaqAPIParams effect callback is fired');
    const interceptor = baseAxiosInstance.interceptors.request.use((config) => {
      const configToBeUpdated = { ...config };

      if (configToBeUpdated.baseURL === appConfig.baseAPIURL) {
        configToBeUpdated.params = {
          ...queryParams,
          ...configToBeUpdated.params,
        };

        return configToBeUpdated;
      }

      return config;
    });

    return () => {
      // console.debug('DEBUG useWethaqAPIParams cleanup callback is fired');
      baseAxiosInstance.interceptors.request.eject(interceptor);
    };
  }, [queryParams]);
};

export default useWethaqAPIParams;
