import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IUpdateGroupMessage } from "@emrgo-frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import debounce from "lodash.debounce";

import { IAutoSaveGroupMessageProps } from "./AutoSave.types";
import { useDeleteMesssages } from "./Hooks";

export const AutoSaveGroupMessage: FC<IAutoSaveGroupMessageProps> = ({
  initial,
  id,
  type,
  isFileUploading,
}) => {
  const client = useQueryClient();
  const navigate = useNavigate();
  const formikContext = useFormikContext();
  const { mutate: deleteMessage } = useDeleteMesssages(queryKeys.secureMessaging.id, `${id}`);
  const { mutate: postDraftMessage } = useMutation(SecureMessagesApi.postGroupMessage, {
    onSuccess: () => {
      console.log("post draft sucess");
      // client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
    },
    onError: () => {},
  });

  const { mutate: updateMessageGroup } = useMutation(SecureMessagesApi.updateGroupMessage, {
    onSuccess: () => {
      console.log("post update sucess");
      // client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
    },
    onError: () => {},
  });
  const saveFormValues = (values: any, id: string) => {
    const filterAddedAttachment = Array.isArray(values.addAttachments)
      ? values.addAttachments.filter((elem) => !elem.id)
      : [];
    const isMessageEmpty =
      Array.isArray(values.addAttachments) &&
      values.addAttachments.length === 0 &&
      values.DeleteAttachmentIds.length === 0 &&
      values.message.length <= 1;
    const payload: IUpdateGroupMessage = {
      ...values,
      status: "Draft",
      addAttachments: filterAddedAttachment,
    };
    if (!payload.messageId) {
      console.log("create draft", payload);
      if (isMessageEmpty) return;
      postDraftMessage({ message: payload, wrapper: type });
    } else {
      console.log("update draft", isMessageEmpty, payload);
      if (!payload.messageId) return;
      isMessageEmpty
        ? deleteMessage({ wrapper: type, id: payload.messageId })
        : updateMessageGroup({ message: payload, wrapper: type, id: payload.messageId });
    }
  };

  const debouncedHandleSaveValues = useMemo(() => debounce(saveFormValues, 2500), []);
  useEffect(() => {
    const equal = JSON.stringify(formikContext?.values) === JSON.stringify(initial);
    if (formikContext.isSubmitting) {
      return;
    }
    if (!equal && !isFileUploading && !formikContext.isSubmitting) {
      debouncedHandleSaveValues(formikContext.values, id);
    }
  }, [formikContext?.values, isFileUploading]);

  return null;
};
