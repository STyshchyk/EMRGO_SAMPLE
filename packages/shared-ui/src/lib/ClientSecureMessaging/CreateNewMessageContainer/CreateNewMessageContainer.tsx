import React, { FC, useState } from "react";

import { getFileUploadLink } from "@emrgo-frontend/services";
import { Select } from "@emrgo-frontend/shared-ui";
import DeleteIcon from "@mui/icons-material/Delete";
import { CircularProgress, TextField } from "@mui/material";
import Chip from "@mui/material/Chip";
import { useMutation } from "@tanstack/react-query";

import { Spacer } from "../../Help Desk/HelpModal.styles";
import { MyTextArea } from "../../MyInput";
import * as Styles from "./CreateNewMessageContainer.styles";
import { ICreateNewMessageContainerProps } from "./CreateNewMessageContainer.types";

export const CreateNewMessageContainer: FC<ICreateNewMessageContainerProps> = ({}) => {
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
  const handleFileDelete = (index: number) => {
    const temp = [...file];
    temp.splice(index, 1);
    setFile(temp);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const formData: any = new FormData();
    formData.append(file.name, file);

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
        <>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "0.5rem" }}>
            <TextField
              onClick={(e) => {
                e.stopPropagation();
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
                <Chip
                  key={index}
                  icon={file.isLoading ? <CircularProgress size={15} /> : <></>}
                  label={file.file.name}
                  onClick={() => {}}
                  onDelete={() => {
                    handleFileDelete(index);
                  }}
                  sx={{
                    borderRadius: "8px",
                  }}
                  deleteIcon={<DeleteIcon />}
                  variant="filled"
                  color={"primary"}
                />
              );
            })}
        </MyTextArea>
      </Styles.MessageInput>
    </>
  );
};
