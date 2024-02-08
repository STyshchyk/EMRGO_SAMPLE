import React, { FC, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useIntersectionObserver } from "usehooks-ts";

import { useFilters } from "../../Context";
import { useUnreadMessagesIds } from "../Hooks";
import * as Styles from "./MessageContainer.styles";
import { IMessageContainerProps } from "./MessageContainer.types";
import { MessageContainerItem } from "./MessageContainerItem";

export const MessageContainer: FC<IMessageContainerProps> = ({
  messsageList,
  isLoading,
  Key,
  scrollDown,
}) => {
  const client = useQueryClient();
  const { id } = useParams();
  const { userType } = useFilters();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const unreadRef = useRef<HTMLDivElement | null>(null);
  const emptyMessageBox = Array.isArray(messsageList?.chain) && messsageList?.chain?.length > 0;
  const { data: ureadMessagesId, refetch } = useUnreadMessagesIds(id, userType, true);
  const { mutate: updateReadtMessages } = useMutation(SecureMessagesApi.usePostReadMessages);
  const entry = useIntersectionObserver(unreadRef, { freezeOnceVisible: false });
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    // Sroll to start of unread message, otherwise scroll to bottom
    if (unreadRef.current)
      setTimeout(() => {
        unreadRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    else if (bottomRef.current)
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
  }, [unreadRef.current, bottomRef.current, id, scrollDown]);

  useEffect(() => {
    return () => {
      // Post unread all message on message group leave, make sure that
      const payload = { groupId: id };
      if (!payload || !ureadMessagesId) return;
      updateReadtMessages(
        {
          wrapper: userType,
          payload,
        },
        {
          onSuccess: () => {
            client
              .invalidateQueries([queryKeys.secureMessaging.id, id], { refetchType: "inactive" })
              .then((value) => {});
            client
              .invalidateQueries([queryKeys.secureMessaging.fetch], { refetchType: "all" })
              .then((value) => {});
          },
        }
      );
    };
  }, [messsageList?.chain]);

  return (
    <Styles.MessageContainer>
      <Styles.MessagesBox $isEmpty={emptyMessageBox} key={Key}>
        {emptyMessageBox &&
          messsageList?.chain.map((elem, index) => {
            return (
              <MessageContainerItem
                elem={elem}
                index={index}
                key={elem.id}
                unreadRef={unreadRef}
                recepient={messsageList}
              />
            );
          })}
      </Styles.MessagesBox>
      <div ref={bottomRef}></div>
    </Styles.MessageContainer>
  );
};
