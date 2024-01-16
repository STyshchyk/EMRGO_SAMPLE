import React, { FC, useState } from "react";

import { AttachedFile, Select, useUploadMessages } from "@emrgo-frontend/shared-ui";
import { TextField } from "@mui/material";

import { Spacer } from "../../Help Desk/HelpModal.styles";
import { MyTextArea } from "../../MyInput";
import * as Styles from "./CreateNewMessageContainer.styles";
import { ICreateNewMessageContainerProps } from "./CreateNewMessageContainer.types";

export const CreateNewMessageContainer: FC<ICreateNewMessageContainerProps> = ({}) => {
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
        <>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "0.5rem" }}>
            <TextField
              onClick={(e) => {
                e.stopPropagation();
              }}
              sx={{
                "& .MuiInput-input": {
                  paddingLeft: "1rem",
                },
              }}
              onChange={(e) => {}}
              label={"Add a subject"}
              name="searchText"
              variant="standard"
              size="small"
            />
            <Select
              type={"standard"}
              placeholder={"Select query"}
              value={queryType}
              onChange={(selectedValue) => {
                setSubject(selectedValue);
              }}
            />
          </div>
        </>
      </Styles.Subject>
      <Spacer />
      <Styles.MessageInput>
        <MyTextArea
          label={"Enter Text"}
          type={"textarea"}
          variant={"signup"}
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
                  index={index}
                  handleFileDelete={() => {
                    handleFileDelete(index);
                  }}
                />
              );
            })}
        </MyTextArea>
      </Styles.MessageInput>
    </>
  );
};
