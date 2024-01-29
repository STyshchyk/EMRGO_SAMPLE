import React from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { TUserType } from "@emrgo-frontend/shared-ui";
import { IMessageChain, IMessageData } from "@emrgo-frontend/types";
import { useQuery } from "@tanstack/react-query";

export const useMessagesQuery = <TData = IMessageData>(
  id: string,
  userType: TUserType,
  enabled: boolean,
  select?: (data: IMessageData) => TData
) => {
  return useQuery([queryKeys.secureMessaging.id, `${id}`], {
    refetchOnMount: "always",
    staleTime: 5000,
    refetchOnWindowFocus: true,
    enabled: enabled ?? false,
    queryFn: async ({ queryKey }) => {
      if (!id) return Promise.reject();
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
  userType: TUserType,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback((data: IMessageData): IMessageData => {
      const chain = data.chain
        .sort((a, b) => {
          return a.index - b.index;
        })
        .filter((elem) => elem.linkStatus !== "Draft")
        .map((elem, index, array) => {
          const modifiedElem = elem;
          const currentElement = array[index],
            prevElement = typeof array[index] !== "undefined" && array[index - 1];
          if (currentElement.isNew && (!prevElement || (prevElement && !prevElement.isNew)))
            modifiedElem.isNewStarted = true;

          return modifiedElem;
        });
      return {
        ...data,
        chain,
      };
    }, [])
  );
};

export const useLastDraftMessageQuery = (
  id: string | undefined,
  userType: TUserType,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback(
      (data: IMessageData): IMessageChain | IMessageData | null => {
        if (data.groupStatus === "Draft" && data.entityType === userType)
          return data as IMessageData;
        const chain: IMessageChain = data.chain.sort((a, b) => {
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
  userType: TUserType,
  enabled: boolean
) => {
  return useMessagesQuery(
    id,
    userType,
    enabled,
    React.useCallback(
      (data: IMessageData): IMessageChain | null => {
        const chain: IMessageChain[] = data.chain.sort((a, b) => {
          return a.index - b.index;
        });

        const draftMessage = chain[data.chain.length - 1];
        if (draftMessage.linkStatus === "Draft" && draftMessage.sender.type === userType)
          return {
            ...data,
            draftMessage,
          };
        return null;
      },
      [id, userType]
    )
  );
};

export const useUnreadMessagesIds = (
  id: string | undefined,
  userType: TUserType,
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
