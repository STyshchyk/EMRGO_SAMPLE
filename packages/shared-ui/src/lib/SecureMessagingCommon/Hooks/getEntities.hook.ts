import { accountIdentification, silverQueryKeys } from "@emrgo-frontend/constants";
import { getEntities } from "@emrgo-frontend/services";
import { IEntity } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

const isKYCApproved = (entity: any) =>
  entity?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
  (entity?.userKycStatus
    ? entity.userKycStatus === accountIdentification.KYC_STATUS_APPROVED // for internal entity api
    : entity?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED); // for legacy entity api //Filter entity at entity level. Users should be filtered at user level by their userKycStatus individually

export const useFetchEntities = (enabled: boolean) => {
  return useQuery<IEntity[], Error>([silverQueryKeys.onboarding.fetch], {
    queryFn: getEntities,
    refetchOnMount: "always",
    staleTime: 60 * 1000,
    enabled,
    select: (data) => {
      return data.filter((entity) => {
        return isKYCApproved(entity);
      });
    },
  });
};
