import React, { FC, useEffect, useId, useState } from "react";
import { useParams } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import {
  AttachedFile,
  AutoSaveGroupMessage,
  MessageContainer,
  useFilters,
  useLastDraftMessageQuery,
  useSortedMessages,
  useToast,
  useUnreadMessagesIds,
  useUploadMessages,
} from "@emrgo-frontend/shared-ui";
import { IUploadMessageGroup } from "@emrgo-frontend/types";
import { customDateFormat } from "@emrgo-frontend/utils";
import { Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";

import { MyTextArea } from "../../MyInput";
import { MessageContainerCommonSchema } from "./MessageContainerCommon.schema";
import * as Styles from "./MessagesContainerCommon.styles";
import { IMessagesContainerCommonProps } from "./MessagesContainerCommon.types";

const initialValue: IUploadMessageGroup = {
  message: "",
  addAttachments: [],
  status: "Sent",
  messageId: null,
  groupId: "",
  DeleteAttachmentIds: [],
  isDraft: false,
  lastTimeSavedDraft: null,
};

export const handlePostGroupMessage = (values, status, groupId) => {
  const payload = {
    ...values,
    status: status,
    groupId,
  };
  return payload;
};
export const MessagesContainerCommon: FC<IMessagesContainerCommonProps> = ({
  isSendMode = false,
}) => {
  const { id } = useParams();
  const messageId = useId();
  const { showWarningToast } = useToast();
  const client = useQueryClient();
  const { isNewMsgGroup, setNewMsgGroup, userType } = useFilters();
  const [isSentMessage, setIsSentMessage] = useState(false);
  const [initialData, setInitialData] = useState<IUploadMessageGroup>(initialValue);
  const [handleFileChange, handleFileDelete, isFileUploading] = useUploadMessages();
  const { data: dataIds } = useUnreadMessagesIds(id, userType, true);

  const { mutate: postMessage } = useMutation(SecureMessagesApi.postGroupMessage, {
    onSuccess: () => {
      client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
    },
    onError: () => {},
  });
  const { mutate: updateMessageGroup } = useMutation(SecureMessagesApi.updateGroupMessage, {
    onSuccess: () => {
      console.log("post update sucess");
      client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
    },
    onError: () => {},
  });

  const {
    data: groupMessages,
    isFetching,
    isError,
    isRefetching,
  } = useSortedMessages(id, userType, true);
  const { data: lastDraftMessage } = useLastDraftMessageQuery(id, userType, true);

  useEffect(() => {
    if (!groupMessages) return;
    //Check wether group status is Draft, change mode to "draft"
    if (groupMessages.groupStatus === "Draft" && isNewMsgGroup !== "draft") {
      setNewMsgGroup("draft");
      return;
    }
  }, [groupMessages]);

  useEffect(() => {
    if (!lastDraftMessage && groupMessages) {
      setInitialData({
        ...initialValue,
        groupId: groupMessages.id,
      });
      return;
    }
    if (lastDraftMessage) {
      const initialData: IUploadMessageGroup = {
        message: lastDraftMessage.message,
        addAttachments: lastDraftMessage?.attachments ?? [],
        status: lastDraftMessage.linkStatus,
        groupId: lastDraftMessage.groupId,
        messageId: lastDraftMessage.id,
        DeleteAttachmentIds: [],
        isDraft: true,
        lastTimeSavedDraft: lastDraftMessage.createdAt,
      };
      setInitialData(initialData);
      return;
    }
  }, [lastDraftMessage, groupMessages]);

  return (
    <>
      <Styles.Subject>
        <div>{groupMessages?.subject ?? ""}</div>
      </Styles.Subject>
      <MessageContainer
        messsageList={groupMessages?.chain}
        isLoading={isRefetching}
        Key={messageId}
        scrollDown={isSentMessage}
      />
      <Styles.MessageInput>
        <Formik
          initialValues={initialData}
          enableReinitialize={true}
          validationSchema={MessageContainerCommonSchema}
          onSubmit={(values, formikHelpers) => {
            const payload = handlePostGroupMessage(values, "Sent", id);
            const secuessCallBack = () => {
              setInitialData(initialValue);
              formikHelpers.setSubmitting(false);
              formikHelpers.resetForm(initialValue);
              setTimeout(() => {
                setIsSentMessage((prevState) => !prevState);
              }, 250);
            };
            // TODO: CHeck if draft message is asdasd
            const shouldUpdateDraft = payload.messageId;
            shouldUpdateDraft
              ? updateMessageGroup(
                  { message: payload, wrapper: userType, id: payload.messageId },
                  {
                    onSuccess: secuessCallBack,
                  }
                )
              : postMessage(
                  { message: payload, wrapper: userType },
                  {
                    onSuccess: secuessCallBack,
                  }
                );
          }}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            isValid,
            setFieldTouched,
            errors,
            touched,
          }) => {
            return (
              <Form>
                {values.isDraft && (
                  <Typography variant={"body2"} color={"info"} className={"mb-0.5 accent-gray-500"}>
                    *Draft saved at {customDateFormat(values.lastTimeSavedDraft)}{" "}
                  </Typography>
                )}
                <AutoSaveGroupMessage
                  initial={initialData}
                  id={id}
                  type={userType}
                  isFileUploading={isFileUploading && isSubmitting}
                />
                <MyTextArea
                  label={"Enter Text"}
                  variant={"signup"}
                  type={"textarea"}
                  error={errors?.message && touched?.message ? errors.message : null}
                  isValidForm={isValid}
                  value={values?.message ?? ""}
                  autoResize={true}
                  onBlur={() => {
                    setFieldTouched("message");
                  }}
                  onChange={(e) => {
                    setFieldValue("message", e.target.value);
                  }}
                  onSendClick={() => {
                    console.log("sent");
                    handleSubmit();
                  }}
                  onAttachlick={(e) => {
                    handleFileChange(e, setFieldValue, values?.addAttachments, "addAttachments");
                  }}
                >
                  {Array.isArray(values?.addAttachments) &&
                    values.addAttachments.map((file, index) => {
                      return (
                        <AttachedFile
                          key={`${file?.fileName} ${index}`}
                          fileName={file?.fileName}
                          isLoading={file?.isLoading ?? false}
                          size={file?.size ?? ""}
                          index={index}
                          handleFileDelete={() => {
                            if (isNewMsgGroup === "none" && "linkId" in file) {
                              const deletedFiles = [...values.DeleteAttachmentIds, file.id];
                              setFieldValue("DeleteAttachmentIds", deletedFiles);
                            }
                            handleFileDelete(
                              index,
                              values?.addAttachments,
                              setFieldValue,
                              "addAttachments"
                            );
                          }}
                        />
                      );
                    })}
                </MyTextArea>
              </Form>
            );
          }}
        </Formik>
      </Styles.MessageInput>
    </>
  );
};
