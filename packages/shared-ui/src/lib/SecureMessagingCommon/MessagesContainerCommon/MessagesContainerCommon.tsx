import React, { FC, useState } from "react";

import {
  AttachedFile,
  MessageContainer,
  useToast,
  useUploadMessages,
} from "@emrgo-frontend/shared-ui";

import { MyTextArea } from "../../MyInput";
import * as Styles from "./MessagesContainerCommon.styles";
import { IMessagesContainerCommonProps } from "./MessagesContainerCommon.types";

export const MessagesContainerCommon: FC<IMessagesContainerCommonProps> = ({
  sendMode,
  isSendMode = false,
}) => {
  const { showWarningToast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [msgSubject, setSubject] = useState(false);
  const [queryType, setQueryType] = useState(false);
  const [handleFileChange, handleFileDelete, file, uploadedFiles] = useUploadMessages();
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <Styles.Subject>
        <div>{"Subject"}</div>
      </Styles.Subject>
      <MessageContainer sendMode={sendMode} isSendMode={isSendMode} />
      <Styles.MessageInput>
        <MyTextArea
          label={"Enter Text"}
          variant={"signup"}
          type={"textarea"}
          autoResize={true}
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
          }}
          onSendClick={() => {
            console.log("sent");
            handleSubmit({ file, messageText });
          }}
          onAttachlick={(e) => {
            handleFileChange(e);
          }}
        >
          {Array.isArray(file) &&
            file.map((file, index) => {
              return (
                <AttachedFile
                  file={file}
                  handleFileDelete={() => {
                    handleFileDelete(index);
                  }}
                  index={index}
                  key={index}
                />
              );
            })}
        </MyTextArea>
      </Styles.MessageInput>
    </>
  );
};
