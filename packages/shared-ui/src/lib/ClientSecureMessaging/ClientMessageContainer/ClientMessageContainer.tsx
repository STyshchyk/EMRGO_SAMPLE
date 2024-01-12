import React, { FC, useState } from "react";

import { getFileUploadLink } from "@emrgo-frontend/services";
import { AttachedFile, MessageContainer, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";

import { MyTextArea } from "../../MyInput";
import * as Styles from "./ClientMessageContainer.styles";
import { IClientMessageContainerProps } from "./ClientMessageContainer.types";

export const ClientMessageContainer: FC<IClientMessageContainerProps> = ({
  sendMode,
  isSendMode = false,
}) => {
  const { showWarningToast } = useToast();
  const [messageText, setMessageText] = useState("");
  const [msgSubject, setSubject] = useState(false);
  const [queryType, setQueryType] = useState(false);
  const [file, setFile] = useState<File | []>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[{ path: string; name: string }] | null>(
    []
  );
  const { mutate: doUploadFile } = useMutation(getFileUploadLink);
  const handleSubmit = (values: any) => {
    console.log(values);
  };
  const handleFileDelete = (index: number | string) => {
    const temp = [...file];
    temp.splice(index, 1);
    setFile(temp);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const formData: any = new FormData();
    formData.append(file.name, file);
    // console.log(BytesToMb(file.size)  );
    // TODO : Add limit amount of file
    // TODO : Add limit for max file size
    // TODO : Add mb display into Attached file

    const files =
      [...event.target.files].map((element) => {
        return { file: element, isLoading: true };
      }) || [];
    setFile((prevState) => [...prevState, ...files]);

    // doUploadFile(
    //   { filename: `${file.name}`, formData },
    //   {
    //     onSuccess: (res) => {
    //       setFile((prevState) => {
    //         const array = [...prevState];
    //         const fileIndex = array.findIndex((elem) => elem.file.name === file.name);
    //         array[fileIndex].isLoading = false;
    //         return array;
    //       });
    //
    //       const currentFile = { path: res.path, name: file.name };
    //       const uploadedFilesTotal = [...uploadedFiles, currentFile];
    //       setUploadedFiles(uploadedFilesTotal);
    //     },
    //     onError: (error) => {
    //       console.log("error", error);
    //     },
    //   }
    // );
  };
  return (
    <>
      <Styles.Subject>
        <div>Subject</div>
      </Styles.Subject>
      <MessageContainer sendMode={sendMode} isSendMode={isSendMode} />
      <Styles.MessageInput>
        <MyTextArea
          label={"Enter Text"}
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
                  handleFileDelete={handleFileDelete}
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
