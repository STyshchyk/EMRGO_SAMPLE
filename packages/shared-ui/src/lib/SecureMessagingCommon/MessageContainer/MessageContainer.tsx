import React, { FC, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import Chip from "@mui/material/Chip";

import { MyTextArea } from "../../MyInput";
import * as Styles from "./MessageContainer.styles";
import { IMessageContainerProps } from "./MessageContainer.types";

export const MessageContainer: FC<IMessageContainerProps> = ({}) => {
  const { id } = useParams();
  const [value, setValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isSent, setIsSend] = useState(false);
  const [file, setFile] = useState<File | []>([]);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // @ts-ignore
    fileInputRef.current.click();
  };

  const handleFileDelete = (index: number) => {
    const temp = [...file];
    temp.splice(index, 1);
    setFile(temp);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...event.target.files] || [];
    setFile((prevState) => [...prevState, ...files]);
    console.log(event.target.files);
    const formData: any = new FormData();
    formData.append("file", event.target.files);
    console.log(formData.values());
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [id, isSent]);
  return (
    <>
      <Styles.Subject>Hello</Styles.Subject>
      <Styles.MessageContainer>
        <Styles.MessagesBox>
          {Array.from(Array(5).keys()).map((elem, index) => {
            return (
              <Styles.MessageItem isSender={index % 2 === 1}>
                <Styles.MessageHeader>
                  <span>Instant Doe</span>
                  <span>15.56 12.12.24</span>
                </Styles.MessageHeader>
                <Styles.MessageContent>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium asperiores
                  at blanditiis delectus dicta facere fugiat itaque magnam maxime minima
                  necessitatibus non numquam obcaecati officia officiis perferendis porro
                  repudiandae, sequi, sit totam vel veritatis voluptatum! Dicta obcaecati sed
                  veniam? Assumenda aut consequatur culpa delectus doloremque dolores libero maxime
                  nam nemo quam qui quidem sapiente sequi, sit, veniam? Aperiam in ipsum officia.
                  Accusamus ad atque debitis delectus deserunt dicta dolor dolore doloremque ipsum
                  iure, magni numquam quas reiciendis rerum sed soluta vel. Autem cupiditate
                  deserunt ducimus enim, eos harum laborum mollitia odit praesentium provident quae
                  quasi qui reiciendis, soluta veniam!
                </Styles.MessageContent>
              </Styles.MessageItem>
            );
          })}
        </Styles.MessagesBox>

        <div ref={bottomRef} />
      </Styles.MessageContainer>
      <Styles.MessageInput>
        <MyTextArea
          label={"Enter Text"}
          type={"textarea"}
          autoResize={true}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onSendClick={() => {
            console.log("click");
            setIsSend((prevState) => !prevState);
          }}
          onAttachlick={() => {
            console.log("attach");
            handleButtonClick();
          }}
        >
          {file.map((file, index) => {
            return (
              <Chip
                label={file.name}
                onClick={() => {}}
                onDelete={() => {
                  handleFileDelete(index);
                }}
                deleteIcon={<DeleteIcon />}
                variant="outlined"
              />
            );
          })}
        </MyTextArea>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={
            "image/jpg, image/jpeg, image/png, application/pdf, .csv, .doc, .docx, .xls, .xlsx, .csv"
          }
          style={{ display: "none" }}
          onChange={(e) => {
            handleFileChange(e);
          }}
        />
      </Styles.MessageInput>
    </>
  );
};
