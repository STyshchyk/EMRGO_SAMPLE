import React from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IMessageChain, IMessageData, TWrapperType as TUserType } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

export const useMessagesQuery = <TData = IMessageData>(
  id: string | undefined,
  userType: TUserType | null,
  enabled: boolean,
  select?: (data: IMessageData) => TData
) => {
  return useQuery([queryKeys.secureMessaging.id, id], {
    refetchOnMount: "always",
    staleTime: 1000 * 5,
    refetchInterval: 1000 * 10,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    enabled: enabled ?? false,
    queryFn: async ({ queryKey }) => {
      if (!id || !userType) return Promise.reject();
      const data = await SecureMessagesApi.fetchGroupMessagesId({
        id: queryKey[1],
        wrapper: userType,
      });
      return data;
    },
    select,
  });
};

export const useSortedMessages = (
  id: string | undefined,
  userType: TUserType | null,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback(
      (data: IMessageData): IMessageData => {
        const chain = data.chain
          .sort((a, b) => {
            return a.index - b.index;
          })
          .filter((elem) => elem.linkStatus !== "Draft")
          .map((elem, index, array) => {
            const modifiedElem = elem;
            const currentElement = array[index],
              prevElement = typeof array[index] !== "undefined" && array[index - 1];
            if (
              currentElement.isNew &&
              (!prevElement || (prevElement && !prevElement.isNew)) &&
              currentElement.entityType !== userType
            )
              modifiedElem.isNewStarted = true;

            return modifiedElem;
          });
        return {
          ...data,
          chain,
        };
      },
      [id, userType]
    )
  );
};

export const useLastDraftMessageQuery = (
  id: string | undefined,
  userType: TUserType | null,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback(
      (data: IMessageData) => {
        if (data.groupStatus === "Draft" && data.entityType === userType)
          return data as IMessageData;
        const chain: IMessageChain[] = data.chain.sort((a, b) => {
          return a.index - b.index;
        });

        const draftMessage = chain[data.chain.length - 1];
        if (draftMessage.linkStatus === "Draft" && draftMessage.sender.type === userType)
          return draftMessage as IMessageChain;
        return null;
      },
      [id, userType]
    )
  );
};

export const useLastDraftQuery = (
  id: string | undefined,
  userType: TUserType | null,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback(
      (data: IMessageData): IMessageData | null => {
        const chain: IMessageChain[] = data.chain.sort((a, b) => {
          return a.index - b.index;
        });

        const draftMessage: IMessageChain = chain[data.chain.length - 1];
        if (draftMessage.linkStatus === "Draft" && draftMessage.sender.type === userType)
          return {
            ...data,
            chain: draftMessage,
          };
        return null;
      },
      [id, userType]
    )
  );
};

export const useUnreadMessagesIds = (
  id: string | undefined,
  userType: TUserType | null,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback(
      (data: IMessageData): string[] | null => {
        const chain: IMessageChain[] = data.chain.reduce((accum, currentValue) => {
          const ids = [...accum];
          if (
            currentValue.linkStatus === "Sent" &&
            currentValue.sender.type !== userType &&
            currentValue.isNew
          ) {
            ids.push(currentValue.id);
          }
          return ids;
        }, []);

        return chain.length > 0 ? chain : undefined;
      },
      [id, userType]
    )
  );
};

// export const useUnreadMessagesIds = (
//   id: string | undefined,
//   userType: TUserType | null,
//   enabled: boolean
// ) => {
//   return useQuery([queryKeys.secureMessaging.id, `${id}`], {
//     refetchOnMount: "always",
//     staleTime: undefined,
//     cacheTime: undefined,
//     keepPreviousData: false,
//     refetchOnWindowFocus: true,
//     enabled: enabled ?? false,
//     queryFn: async ({ queryKey }) => {
//       if (!id || !userType) return Promise.reject();
//       const data = await SecureMessagesApi.fetchGroupMessagesId({
//         id: queryKey[1],
//         wrapper: userType,
//       });
//       return data;
//     },
//     select: React.useCallback(
//       (data: IMessageData): string[] | null => {
//         const chain: IMessageChain[] = data.chain.reduce((accum, currentValue) => {
//           const ids = [...accum];
//           if (
//             currentValue.linkStatus === "Sent" &&
//             currentValue.sender.type !== userType &&
//             currentValue.isNew
//           ) {
//             ids.push(currentValue.id);
//           }
//           return ids;
//         }, []);
//
//         return chain.length > 0 ? chain : undefined;
//       },
//       [id, userType]
//     ),
//   });
// };
