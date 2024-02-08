import React from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { ISecureAudit, TGroupStatus, TWrapperType as TUserType } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

export const useFetchAutditHistory = <TData = ISecureAudit>(
  userType: TUserType | null,
  auditUrl: string,
  select: (data: ISecureAudit) => TData
) => {
  return useQuery([queryKeys.secureMessaging.auditHistory, auditUrl], {
    queryFn: ({ queryKey }) => {
      return SecureMessagesApi.fetchAuditHistory({ wrapper: userType, groupId: queryKey[1] });
    },
    staleTime: 1000 * 1,
    refetchOnMount: "always",
    enabled: auditUrl.length > 0,
    select,
  });
};

export const useFetchAutditHistoryCombined = <TData = ISecureAudit>(
  userType: TUserType | null,
  auditUrl: string
) => {
  return useFetchAutditHistory(
    userType,
    auditUrl,
    React.useCallback(
      (data): ISecureAudit => {
        const combinedData = [].concat(data.external ?? [], data.internal ?? []).sort((a, b) => {
          return new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf();
        });

        return combinedData;
      },
      [auditUrl]
    )
  );
};

export const useFetchLastGroupStatus = <TData = TGroupStatus>(
  userType: TUserType | null,
  auditUrl: string
) => {
  return useFetchAutditHistory(
    userType,
    auditUrl,
    React.useCallback(
      (data): TGroupStatus => {
        const sortedData: ISecureAudit = [
          ...(userType === "client" ? data.external ?? [] : data.internal ?? []),
        ].sort((a, b) => {
          return new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf();
        });
        const currentStatus =
          Array.isArray(sortedData) && sortedData.length > 0
            ? sortedData[sortedData.length - 1].newStatus
            : "New";

        return currentStatus;
      },
      [auditUrl]
    )
  );
};
