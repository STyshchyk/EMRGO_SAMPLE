import { queryKeys } from "@emrgo-frontend/constants";
import { useQueryClient } from "@tanstack/react-query";

const useRefreshProfile = () => {
  const queryClient = useQueryClient();

  const refreshProfile = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeys.account.profile.fetch],
      exact: true,
    });
  };

  return refreshProfile;
};

export default useRefreshProfile;
