import React, { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { clientAccountRoutes, silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi, useFetchDropdowns } from "@emrgo-frontend/services";
import {
  AttachedFile,
  AutoSaveGroup,
  FormikInputCustom,
  Spinner,
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
  attachments: null,
  isFlagged: true,
  groupStatus: "Sent",
  DeleteAttachmentIds: [],
  isDraft: false,
  lastTimeSavedDraft: null,
};

export const transformResponseToDraft = (data: any, labelData) => {
  const isMessagePresent = "chain" in data;
  const drafInitialValue: IUploadnNewGroupInitialValuesProps = {
    message: isMessagePresent ? data.chain[0].message : "",
    label: labelData?.message_label.filter((elem) => elem.id === data.label.id),
    subject: data.subject,
    isFlagged: data?.isFlagged || false,
    groupStatus: data.groupStatus,
    DeleteAttachmentIds: [],
    isBrodcast: Array.isArray(data.creatorEntities) && data.creatorEntities.length > 1,
    attachments: isMessagePresent ? data.chain[0].attachments : [],
    isDraft: true,
    lastTimeSavedDraft: customDateFormat(data.updatedAt),
  };
  return drafInitialValue;
};

export const handleCreateGroupMessagePayload = (values: any, status: TMessageStatus = "Sent") => {
  const filterAttachment = Array.isArray(values.attachments) ? values.attachments : [];
  const payload: IUploadNewGroup = {
    label: values?.label?.id,
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
  const filterDeletedAttachemtn = values.DeleteAttachmentIds;
  const filterAddedAttachment = Array.isArray(values.attachments)
    ? values.attachments.filter((elem) => !elem.id)
    : [];
  const payload: IUploadDraftMessage = {
    label: Array.isArray(values.label) ? values?.label[0]?.id : values?.label?.id,
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
  const id = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValue] =
    useState<IUploadnNewGroupInitialValuesProps>(initialValues2);
  const [handleFileChange, handleFileDelete, isFileUploading] = useUploadMessages();
  const { isNewMsgGroup, userType, setNewMsgGroup } = useFilters();
  const {
    data: labelData,
    isRefetching: isLabelFetching,
    isSuccess: isLabelSuccess,
  } = useFetchDropdowns("message_label");

  const { mutate: updateGroup } = useMutation(SecureMessagesApi.updateNewGroupMessage, {
    onSuccess: (data) => {
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {
        const route = reverse(`${clientAccountRoutes.secureMessaging.inbox.home}`, {});
        setNewMsgGroup("none");
        navigate(route);
      });
    },
  });
  const { mutate: postGroup } = useMutation(SecureMessagesApi.postNewGroup, {
    onSuccess: (data) => {
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {});
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { data: draftMessage, isFetching } = useLastDraftMessageQuery(
    extractId(id),
    userType,
    !isLabelFetching && isNewMsgGroup === "draft" && isLabelSuccess
  );

  useEffect(() => {
    if (!draftMessage) return;
    const drafInitialValue = transformResponseToDraft(draftMessage, labelData);
    setInitialValue((prevState) => {
      return drafInitialValue;
    });
  }, [draftMessage]);
  const handleSubmit = (values: any) => {
    console.log(values);
  };
  if (isFetching && isNewMsgGroup === "draft" && !draftMessage) return <Spinner />;
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={PostMessageSchema}
      onSubmit={(values, formikHelpers) => {
        formikHelpers.setSubmitting(true);
        const sucessCallback = () => {
          formikHelpers.resetForm(initialValues2);
          setInitialValue((prevState) => {
            return initialValues2;
          });
        };
        if (isNewMsgGroup === "draft") {
          const updateDraftToSent = handleUpdateDraftMessageData(values, draftMessage, "Sent");

          updateGroup(
            {
              message: updateDraftToSent,
              wrapper: userType,
              id: extractId(id),
            },
            {
              onSuccess: sucessCallback,
            }
          );
        } else {
          const payload = handleCreateGroupMessagePayload(values, "Sent");
          postGroup(
            { message: payload, wrapper: userType },
            {
              onSuccess: sucessCallback,
            }
          );
        }
      }}
    >
      {({
        values,
        setFieldValue,
        handleSubmit,
        isSubmitting,
        setFieldTouched,
        errors,
        isValid,
      }) => {
        return (
          <Form className={"h-full flex flex-col"}>
            <AutoSaveGroup
              initial={initialValues}
              updateDraftMessageData={handleUpdateDraftMessageData(values, draftMessage)}
              draftMessageData={handleCreateGroupMessagePayload(values, "Draft")}
              id={extractId(id)}
              isFileUploading={isFileUploading && isSubmitting}
              isSubmitting={isSubmitting}
            />
            <Styles.Subject>
              <div className={"flex flex-col w-full gap-2"}>
                <Field
                  component={FormikInputCustom}
                  type={"text"}
                  removeBorder={false}
                  variant={"signup"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("subject", e.target.value);
                  }}
                  label={"Add a subject"}
                  name="subject"
                  id="subject"
                  value={values?.subject || ""}
                />
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
