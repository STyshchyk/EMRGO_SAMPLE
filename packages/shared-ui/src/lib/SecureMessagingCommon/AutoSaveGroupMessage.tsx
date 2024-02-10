import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IUpdateGroupMessage } from "@emrgo-frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import debounce from "lodash.debounce";

import { useFilters } from "../Context";
import { IAutoSaveGroupMessageProps } from "./AutoSave.types";
import { useDeleteMesssages } from "./Hooks";

export const AutoSaveGroupMessage: FC<IAutoSaveGroupMessageProps> = ({
  initial,
  id,
  isFileUploading,
  isSubmitting,
}) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { userType: type } = useFilters();
  const formikContext = useFormikContext();
  const { mutate: deleteMessage } = useDeleteMesssages(
    [queryKeys.secureMessaging.id, `${id}`],
    type
  );
  const { mutate: postDraftMessage } = useMutation(SecureMessagesApi.postGroupMessage, {
    onSuccess: () => {
      console.log("post draft sucess");
      client.invalidateQueries([queryKeys.secureMessaging.id, id]).then(() => {});
    },
    onError: () => {},
  });

  const { mutate: updateMessageGroup } = useMutation(SecureMessagesApi.updateGroupMessage, {
    onSuccess: () => {
      console.log("post update sucess");
      client.invalidateQueries([queryKeys.secureMessaging.id, id]).then(() => {});
    },
    onError: () => {},
  });
  const saveFormValues = (values: any, id: string | undefined) => {
    const filterAddedAttachment = Array.isArray(values.addAttachments)
      ? values.addAttachments.filter((elem) => !elem.id)
      : [];
    const isMessageEmpty =
      Array.isArray(values.addAttachments) &&
      values.addAttachments.length === 0 &&
      values.DeleteAttachmentIds.length === 0 &&
      values.message.length <= 0;

    if (!values.messageId) {
      const payload: IUpdateGroupMessage = {
        ...values,
        status: "Draft",
        attachments: filterAddedAttachment,
      };
      console.log("create draft", isMessageEmpty, payload, values);
      if (isMessageEmpty) return;
      postDraftMessage({ message: payload, wrapper: type });
    } else {
      const payload: IUpdateGroupMessage = {
        ...values,
        status: "Draft",
        addAttachments: filterAddedAttachment,
      };
      console.log("update draft", isMessageEmpty, payload, values);
      if (!payload.messageId) return;
      console.log("pre delete", isMessageEmpty);
      isMessageEmpty
        ? deleteMessage({ wrapper: type, id: payload.messageId })
        : updateMessageGroup({ message: payload, wrapper: type, id: payload.messageId });
    }
  };

  const debouncedHandleSaveValues = useMemo(() => debounce(saveFormValues, 2000), []);
  useEffect(() => {
    const equal = JSON.stringify(formikContext?.values) === JSON.stringify(initial);
    // console.log("isFileUploading", isFileUploading, "isSubmitting", isSubmitting);

    if (formikContext.isSubmitting || isFileUploading || !initial.groupId || !id || isSubmitting) {
      debouncedHandleSaveValues.cancel();
      console.log("return");
      return;
    }
    if (!equal && !isFileUploading && !formikContext.isSubmitting) {
      // console.log("formikContext?.values", formikContext?.values, "/n", "initial", initial);
      debouncedHandleSaveValues(formikContext.values, id);
    }
  }, [formikContext?.values, formikContext?.isSubmitting, isFileUploading, isSubmitting]);

  return null;
};
