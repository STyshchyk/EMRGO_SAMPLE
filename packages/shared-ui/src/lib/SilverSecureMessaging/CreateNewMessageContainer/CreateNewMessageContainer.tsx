import React, { FC, useState } from "react";

import { accountIdentification, silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { getEntities, useFetchDropdowns } from "@emrgo-frontend/services";
import { AttachedFile, Checkbox, Select, useUploadMessages } from "@emrgo-frontend/shared-ui";
import { IEntity } from "@emrgo-frontend/types";
import { TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { Spacer } from "../../Help Desk/HelpModal.styles";
import { MyTextArea } from "../../MyInput";
import * as Styles from "./CreateNewMessageContainer.styles";
import { ICreateNewMessageContainerProps } from "./CreateNewMessageContainer.types";

const isKYCApproved = (entity: any) =>
  entity?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
  (entity?.userKycStatus
    ? entity.userKycStatus === accountIdentification.KYC_STATUS_APPROVED // for internal entity api
    : entity?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED); // for legacy entity api //Filter entity at entity level. Users should be filtered at user level by their userKycStatus individually

export const CreateNewMessageContainer: FC<ICreateNewMessageContainerProps> = ({}) => {
  const [messageText, setMessageText] = useState("");
  const [entityList, setEnitityList] = useState<IEntity>();
  const [label, setLabel] = useState<IEntity>();
  const [queryType, setQueryType] = useState(false);
  const [isBrodcastEnabled, setBrodcastEnabled] = useState<boolean>(false);
  const [handleFileChange, handleFileDelete, file, uploadedFiles] = useUploadMessages();
  const { data: labelData } = useFetchDropdowns("message_label");

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  const { data, isError, isFetching } = useQuery({
    queryFn: getEntities,
    staleTime: 3600,
    queryKey: [queryKeys.onboarding.fetch],
    select: (data) => {
      return data.filter((entity) => {
        return isKYCApproved(entity);
      });
    },
  });

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
              className={"w-full border-solid border-0 border-b border-gray-400"}
              type={"standard"}
              placeholder={"Select Label"}
              value={label}
              isClearable={true}
              options={labelData?.message_label}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option}
              onChange={(selectedValue) => {
                setLabel(selectedValue);
              }}
            />
            <div className={"flex items-center"}>
              <Select
                className={"w-full border-solid border-0 border-b border-gray-400"}
                type={"standard"}
                isClearable={true}
                isMulti={isBrodcastEnabled}
                placeholder={"Select entity"}
                value={entityList}
                options={data}
                getOptionLabel={(option) => option.entityName}
                getOptionValue={(option) => option}
                onChange={(selectedValue) => {
                  setEnitityList(selectedValue);
                }}
              />
              <Checkbox
                checked={isBrodcastEnabled}
                onChange={(e) => {
                  setBrodcastEnabled(e.target.checked);
                  if (!e.target.checked && entityList) {
                    setEnitityList(entityList[0]);
                  }
                }}
              >
                Brodcast
              </Checkbox>
            </div>
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
