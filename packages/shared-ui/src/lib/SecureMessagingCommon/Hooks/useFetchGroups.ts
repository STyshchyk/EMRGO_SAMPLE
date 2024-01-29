import React from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IGroups } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

import { TUserType } from "../../Context";

export const useFetchGroupsQuery = <TData = IGroups[]>(
  userType: TUserType,
  select: (data: IGroups[]) => TData
) => {
  return useQuery({
    queryKey: [queryKeys.secureMessaging.fetch],
    staleTime: 1000 * 6,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: true,
    queryFn: () => {
      return SecureMessagesApi.fetchGroups({ wrapper: userType });
    },
    select,
  });
};

export const useFetchGroups = (userType: TUserType) => {
  return useFetchGroupsQuery(
    userType,
    React.useCallback((data): IGroups[] => {
      const sortedData = data.sort((a, b) => {
        return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
      });
      return sortedData;
    }, [])
  );
};

export const useFetchUndeadGroupsCount = (userType: TUserType) => {
  return useFetchGroupsQuery(
    userType,
    React.useCallback((data) => {
      const sortedData = data.reduce((accum, currentValue) => {
        if (currentValue.groupStatus === "Draft" || currentValue.entityType === userType)
          return accum;
        const curCounter =
          userType === "client"
            ? currentValue?.unread.newInternal
            : currentValue?.unread.newExternal;

        return curCounter > 0 ? ++accum : accum;
      }, 0);

      return sortedData;
    }, [])
  );
};

// export const useFetchGroupsQuery = (userType: TUserType) => {
//   return useQuery({
//     queryKey: [queryKeys.secureMessaging.fetch],
//     staleTime: 1000 * 6,
//     refetchInterval: 1000 * 5,
//     refetchIntervalInBackground: true,
//     queryFn: () => {
//       return SecureMessagesApi.fetchGroups({ wrapper: userType });
//     },
//     select: (data) => {
//       const sortedData = data.sort((a, b) => {
//         return new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();
//       });
//       return sortedData;
//     }
//   });
// };
