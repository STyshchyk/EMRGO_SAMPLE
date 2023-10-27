import { queryKeys } from "@emrgo-frontend/constants";
import { useQuery } from "@tanstack/react-query";

import * as wethaqAPIService from "../services/wethaqAPIService";

const useSafeAccount = (payload) => {
  return useQuery([queryKeys.safeAccounts], {
    queryFn: () => wethaqAPIService.safeAccountApi.getSafeAccountApi(payload),
  });
};
export default useSafeAccount;
