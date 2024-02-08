import React from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IGroups, TWrapperType as TUserType } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

export const useFetchGroupsQuery = <TData = IGroups[]>(
  userType: TUserType,
  select: (data: IGroups[]) => TData
) => {
  return useQuery({
    queryKey: [queryKeys.secureMessaging.fetch],
    refetchOnMount: "always",
    staleTime: 1000 * 5000,
    refetchInterval: 1000 * 1000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
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
      const unreadData = data
        .map((elem) => {
          const currentValue = elem;
          const curCounter =
            userType === "client"
              ? currentValue?.unread?.newInternal
              : currentValue?.unread?.newExternal;

          return { ...currentValue, isNew: curCounter > 0 };
        })
        .sort((a, b) => {
          const dateCompare = new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf();

          const unread1 = b.isNew,
            unread2 = a.isNew;

          if (unread1 && !unread2) return 1;
          else if (!unread1 && unread2) return -1;
          else {
            return dateCompare;
          }
        });

      return unreadData;
    }, [])
  );
};

export const useFetchUndeadGroupsCount = (userType: TUserType) => {
  return useFetchGroupsQuery(
    userType,
    React.useCallback((data) => {
      const sortedData = data.reduce((accum, currentValue) => {
        if (currentValue.groupStatus === "Draft") return accum;
        const curCounter =
          userType === "client"
            ? currentValue?.unread?.newInternal
            : currentValue?.unread?.newExternal;
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
