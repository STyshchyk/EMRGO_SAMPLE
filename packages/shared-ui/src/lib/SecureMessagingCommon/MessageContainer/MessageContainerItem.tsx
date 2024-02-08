import React, { FC, RefObject } from "react";

import { IMessageData } from "@emrgo-frontend/types";
import { DEFAULT_DATE_TIME_FORMAT_SM } from "@emrgo-frontend/utils";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import dayjs from "dayjs";

import { useFilters } from "../../Context";
import { AttachedFile } from "../AttachedFile";
import * as Styles from "./MessageContainer.styles";

export const MessageContainerItem: FC<{
  elem: any;
  index: number;
  unreadRef: RefObject<HTMLElement | null>;
  recepient: IMessageData;
}> = ({ elem, index, unreadRef, recepient }) => {
  const { userType } = useFilters();

  const files = elem?.attachments ?? [];
  const sender = elem?.sender;
  const date = dayjs(elem.sentAt).format(DEFAULT_DATE_TIME_FORMAT_SM);
  const isCurrentMsgBelongToSender = elem.sender.type === userType;
  const isNewMessagesPoint = elem.isNewStarted;

  return (
    <React.Fragment key={elem.id}>
      {isNewMessagesPoint && (
        <Divider
          className={"pt-2"}
          textAlign={!isCurrentMsgBelongToSender ? "left" : "right"}
          ref={unreadRef}
        >
          <Chip label="New" size="small" />
        </Divider>
      )}
      <Styles.MessageItem $isSender={!isCurrentMsgBelongToSender}>
        <Styles.MessageHeader>
          <div className={"flex flex-col justify-start"}>
            <span>
              {sender.firstName} {sender.lastName}
            </span>
            <span>
              to:
              {isCurrentMsgBelongToSender
                ? ` ${recepient?.creator?.firstName} ${recepient?.creator?.lastName}`
                : ` ${recepient?.entities?.name}`}
            </span>
          </div>
          <span>{date}</span>
        </Styles.MessageHeader>
        <Styles.MessageContent>{elem?.message}</Styles.MessageContent>
        {Array.isArray(files) && files.length > 0 && (
          <Styles.MessageFilesContainer>
            {files.map((file, index) => {
              return (
                <AttachedFile
                  key={index}
                  variant={"outlined"}
                  color={"default"}
                  index={index}
                  fileName={file?.fileName ?? "test_name.pdf"}
                  isLoading={false}
                  size={file?.size ?? "100KiB"}
                />
              );
            })}
          </Styles.MessageFilesContainer>
        )}
      </Styles.MessageItem>
    </React.Fragment>
  );
};
