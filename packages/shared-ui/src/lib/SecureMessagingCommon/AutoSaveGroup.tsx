import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { clientAccountRoutes, silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { SecureMessagesApi } from "@emrgo-frontend/services";
import { IUploadDraftMessage, IUploadNewGroup } from "@emrgo-frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormikContext } from "formik";
import debounce from "lodash.debounce";
import { reverse } from "named-urls";

import { useFilters } from "../Context";
import { IAutoSaveGroupProps } from "./AutoSave.types";

export const AutoSaveGroup: FC<IAutoSaveGroupProps> = ({
  initial,
  updateDraftMessageData,
  draftMessageData,
  id,
  isFileUploading,
}) => {
  const client = useQueryClient();
  const { userType: type } = useFilters();
  const { setNewMsgGroup, isNewMsgGroup } = useFilters();
  const navigate = useNavigate();
  const formikContext = useFormikContext();
  const { mutate: updateMessage } = useMutation(SecureMessagesApi.updateNewGroupMessage, {
    onSuccess: () => {
      console.log("auto save success");
      client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
      // client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {});
    },
  });
  const { mutate: postMessageGroup } = useMutation(SecureMessagesApi.postNewGroup, {
    onSuccess: (data) => {
      const id = data.data?.id ?? data.data[0].id;
      const route = reverse(`${clientAccountRoutes.secureMessaging.inbox.id}`, {
        id,
      });
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {
        setNewMsgGroup("draft");
        navigate(route);
      });
    },
  });
  const saveFormValues = (
    updateDraftMessageData: IUploadDraftMessage,
    draftMessageData: IUploadNewGroup,
    id: string,
    initial: any
  ) => {
    //Check wether id is exits in params which indicats that current message is draft other wise user is about to create a message so save it as draft
    if (id) {
      const payload = updateDraftMessageData;
      console.log(type);
      console.log("update draft", isNewMsgGroup, "payload", payload, "initial", initial);
      if (!payload.subject || !payload.label) return;
      updateMessage({ message: payload, wrapper: type, id });
    } else {
      const payload = draftMessageData;
      console.log(type);
      console.log("first draft", isNewMsgGroup, "payload", payload, "initial", initial);
      if (!payload.subject || !payload.label) return;
      postMessageGroup({ message: payload, wrapper: type });
    }
  };

  const debouncedHandleSaveValues = useMemo(() => debounce(saveFormValues, 5000), []);
  useEffect(() => {
    const equal = JSON.stringify(formikContext?.values) === JSON.stringify(initial);
    if (isFileUploading || formikContext.isSubmitting) {
      debouncedHandleSaveValues.cancel();
      console.log("return");
      return;
    }

    if (!equal && !isFileUploading) {
      console.log("initial", initial, "\nformikContext.values", formikContext.values);
      debouncedHandleSaveValues(updateDraftMessageData, draftMessageData, id, initial);
    }
  }, [formikContext?.values, formikContext.isSubmitting]);

  return null;
};
