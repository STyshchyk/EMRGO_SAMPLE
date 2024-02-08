import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { clientAccountRoutes, silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi, useFetchDropdowns } from "@emrgo-frontend/services";
import {
  AttachedFile,
  AutoSaveGroup,
  Checkbox,
  FormikInputCustom,
  MultiValue,
  Spinner,
  useFetchEntities,
  useFilters,
  useLastDraftMessageQuery,
  useUploadMessages,
} from "@emrgo-frontend/shared-ui";
import { IUploadDraftMessage, IUploadNewGroup, TMessageStatus } from "@emrgo-frontend/types";
import { customDateFormat, extractId } from "@emrgo-frontend/utils";
import { Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import { reverse } from "named-urls";

import { Spacer } from "../../Help Desk/HelpModal.styles";
import { PostMessageSchema } from "./CreateNewMessage.schema";
import * as Styles from "./CreateNewMessageContainer.styles";
import {
  ICreateNewMessageContainerProps,
  IUploadnNewGroupInitialValuesProps,
} from "./CreateNewMessageContainer.types";

const initialValues2: IUploadnNewGroupInitialValuesProps = {
  message: "",
  label: "",
  subject: "",
  creatorEntities: [],
  attachments: undefined,
  isFlagged: true,
  isBrodcast: false,
  groupStatus: "Sent",
  DeleteAttachmentIds: [],
  isDraft: false,
  lastTimeSavedDraft: null,
};

export const transformResponseToDraft = (data: any, entityData: any, labelData: any) => {
  const listOfEntitites = Array.isArray(data.creatorEntities) && data.creatorEntities.length > 0;
  const list = listOfEntitites
    ? entityData.filter((elem) => {
        return data.creatorEntities.indexOf(elem.entityId) >= 0;
      })
    : undefined;
  const isMessagePresent = "chain" in data;
  const drafInitialValue: IUploadnNewGroupInitialValuesProps = {
    message: isMessagePresent ? data.chain[0].message : "",
    label: labelData?.message_label.filter((elem) => elem.id === data.label_id)[0],
    subject: data.subject,
    isFlagged: data?.isFlagged || false,
    groupStatus: data.groupStatus,
    DeleteAttachmentIds: [],
    isBrodcast: Array.isArray(data.creatorEntities) && data.creatorEntities.length > 1,
    attachments: isMessagePresent ? data?.chain[0]?.attachments : [],
    creatorEntities: list,
    isDraft: true,
    lastTimeSavedDraft: customDateFormat(data.updatedAt),
  };
  return drafInitialValue;
};

export const handleCreateGroupMessagePayload = (values: any, status: TMessageStatus = "Sent") => {
  const filterEntity: string | string[] | [] = Array.isArray(values.creatorEntities)
    ? values.creatorEntities.map((elem) => elem.entityId)
    : values?.creatorEntities?.entityId
    ? [values?.creatorEntities?.entityId]
    : [];
  const filterAttachment = Array.isArray(values.attachments) ? values.attachments : undefined;
  const payload: IUploadNewGroup = {
    label: values?.label?.id,
    creatorEntities: filterEntity,
    message: values.message,
    attachments: filterAttachment,
    subject: values.subject,
    groupStatus: status,
    isFlagged: false,
  };
  return payload;
};

export const handleUpdateDraftMessageData = (
  values: IUploadnNewGroupInitialValuesProps,
  draftMessageData: any,
  status: TMessageStatus = "Draft"
) => {
  const filterEntity = Array.isArray(values.creatorEntities)
    ? values.creatorEntities.map((elem) => elem.entityId)
    : values?.creatorEntities?.entityId
    ? [values?.creatorEntities?.entityId]
    : [];
  const filterDeletedAttachemtn = values.DeleteAttachmentIds;
  const filterAddedAttachment = Array.isArray(values.attachments)
    ? values.attachments.filter((elem) => !elem.id)
    : [];
  const payload: IUploadDraftMessage = {
    label: Array.isArray(values.label) ? values?.label[0]?.id : values?.label?.id,
    creatorEntities: filterEntity,
    message: values.message,
    addAttachments: filterAddedAttachment,
    DeleteAttachmentIds: filterDeletedAttachemtn,
    isFlagged: draftMessageData?.isFlagged ?? true,
    subject: values.subject,
    groupStatus: status,
  };
  return payload;
};

export const CreateNewMessageContainer: FC<ICreateNewMessageContainerProps> = ({}) => {
  const client = useQueryClient();
  const currentId = useParams();
  const id = extractId(currentId) || "";
  const navigate = useNavigate();
  const [initialValues, setInitialValue] =
    useState<IUploadnNewGroupInitialValuesProps>(initialValues2);
  const [handleFileChange, handleFileDelete, isFileUploading] = useUploadMessages();
  const { isNewMsgGroup, userType, setNewMsgGroup } = useFilters();
  const { data: entityData, isRefetching: isEntityFetching, isSuccess } = useFetchEntities(true);

  const {
    data: labelData,
    isRefetching: isLabelFetching,
    isSuccess: isLabelSuccess,
  } = useFetchDropdowns("message_label");

  const { mutate: updateMessage } = useMutation(SecureMessagesApi.updateNewGroupMessage, {
    onSuccess: (data) => {
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {
        const route = reverse(`${clientAccountRoutes.secureMessaging.inbox.home}`, {});
        setNewMsgGroup("none");
        navigate(route);
      });
    },
  });
  const { mutate } = useMutation(SecureMessagesApi.postNewGroup, {
    onSuccess: (data) => {
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {});
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const {
    data: draftMessage,
    isFetching,
    isRefetching,
  } = useLastDraftMessageQuery(
    id,
    userType,
    isLabelSuccess && isNewMsgGroup === "draft" && isSuccess
  );
  useEffect(() => {
    console.log(id, "hello id");
    // if (!extractId(id) && i) setNewMsgGroup("none");
    if (!draftMessage || !entityData || !labelData) return;
    const drafInitialValue = transformResponseToDraft(draftMessage, entityData, labelData);
    console.log(drafInitialValue);
    setInitialValue((prevState) => {
      return drafInitialValue;
    });
  }, [id, entityData, labelData, draftMessage]);

  if (isFetching && isNewMsgGroup === "draft" && !draftMessage) return <Spinner />;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PostMessageSchema}
      enableReinitialize={true}
      onSubmit={(values, formikHelpers) => {
        const sucessCallback = () => {
          console.log("sent");
          setInitialValue((prevState) => {
            return initialValues2;
          });
          formikHelpers.resetForm({ values: initialValues2 });
        };

        if (isNewMsgGroup === "draft") {
          const updateDraftToSent = handleUpdateDraftMessageData(values, draftMessage, "Sent");
          updateMessage(
            {
              message: updateDraftToSent,
              wrapper: userType,
              id: id,
            },
            {
              onSuccess: sucessCallback,
            }
          );
        } else {
          const payload = handleCreateGroupMessagePayload(values, "Sent");
          mutate({ message: payload, wrapper: userType }, { onSuccess: sucessCallback });
        }
      }}
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting, setFieldTouched, isValid }) => {
        return (
          <Form className={"h-full flex flex-col"}>
            <AutoSaveGroup
              initial={initialValues}
              updateDraftMessageData={handleUpdateDraftMessageData(values, draftMessage)}
              draftMessageData={handleCreateGroupMessagePayload(values, "Draft")}
              id={id}
              isFileUploading={isFileUploading && isSubmitting}
            />
            <Styles.Subject>
              <div className={"flex flex-col w-full gap-2"}>
                <div className={""}>
                  <Field
                    component={FormikInputCustom}
                    type={"text"}
                    removeBorder={false}
                    variant={"signup"}
                    value={values?.subject || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("subject", e.target.value);
                    }}
                    label={"Add a subject"}
                    name="subject"
                    id="subject"
                    size="small"
                  />
                </div>
                <div className={""}>
                  <Field
                    component={FormikInputCustom}
                    type={"select"}
                    placeholder={"Label"}
                    value={values?.label || ""}
                    name={"label"}
                    removeBorder={false}
                    menuPortalTarget={document.body}
                    variant={"signup"}
                    id={"label"}
                    isClearable={true}
                    options={labelData?.message_label}
                    getOptionLabel={(option: any) => option.label}
                    getOptionValue={(option: any) => option}
                    onBlur={() => {
                      setFieldTouched("label");
                    }}
                    onChange={(selectedValue: any) => {
                      setFieldValue("label", selectedValue);
                    }}
                  />
                </div>

                <div className={"flex items-center pr-4 "}>
                  <Field
                    component={FormikInputCustom}
                    type={"select"}
                    isClearable={true}
                    components={{ MultiValue }}
                    removeBorder={false}
                    menuPortalTarget={document.body}
                    variant={"signup"}
                    closeMenuOnSelect={!(values?.isBrodcast || false)}
                    isMulti={values?.isBrodcast || false}
                    placeholder={"To Entity"}
                    value={values?.creatorEntities || null}
                    name={"creatorEntities"}
                    options={entityData}
                    getOptionLabel={(option: any) => option.entityName}
                    getOptionValue={(option: any) => option}
                    onBlur={() => {
                      setFieldTouched("creatorEntities");
                    }}
                    onChange={(selectedValue: any) => {
                      setFieldValue("creatorEntities", selectedValue);
                    }}
                  />
                  <Checkbox
                    checked={values?.isBrodcast || false}
                    className={"ml-2"}
                    onChange={(e) => {
                      setFieldValue("isBrodcast", e.target.checked);
                      if (!e.target.checked && values?.creatorEntities) {
                        const entity = Array.isArray(values?.creatorEntities);
                        setFieldValue(
                          "creatorEntities",
                          entity ? values?.creatorEntities[0] : values.creatorEntities
                        );
                      }
                    }}
                  >
                    Brodcast
                  </Checkbox>
                </div>
              </div>
            </Styles.Subject>
            <Spacer />
            <Styles.MessageInput>
              {values.isDraft && (
                <Typography variant={"body2"} color={"info"} className={"mb-0.5 accent-gray-500"}>
                  *Draft saved at {`${values.lastTimeSavedDraft}`}{" "}
                </Typography>
              )}
              <Field
                component={FormikInputCustom}
                type={"textarea"}
                label={"Enter Text"}
                name={"message"}
                variant={"signup"}
                isValidForm={isValid}
                id={"message"}
                autoResize={true}
                value={values?.message || ""}
                onBlur={() => {
                  setFieldTouched("message");
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("message", e.target.value);
                }}
                onSendClick={() => {
                  handleSubmit();
                }}
                onAttachlick={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleFileChange(e, setFieldValue, values?.attachments, "attachments");
                }}
              >
                {Array.isArray(values?.attachments) &&
                  values.attachments.map((file, index) => {
                    return (
                      <AttachedFile
                        key={`${file?.fileName} ${index}`}
                        fileName={file?.fileName ?? ""}
                        isLoading={file?.isLoading ?? false}
                        size={file?.size ?? "0"}
                        index={index}
                        handleFileDelete={() => {
                          if (isNewMsgGroup === "draft" && "linkId" in file) {
                            const deletedFiles = [
                              ...(values.DeleteAttachmentIds as string[]),
                              file.id,
                            ];
                            setFieldValue("DeleteAttachmentIds", deletedFiles);
                          }
                          handleFileDelete(
                            index,
                            values?.attachments,
                            setFieldValue,
                            "attachments"
                          );
                        }}
                      />
                    );
                  })}
              </Field>
            </Styles.MessageInput>
          </Form>
        );
      }}
    </Formik>
  );
};
