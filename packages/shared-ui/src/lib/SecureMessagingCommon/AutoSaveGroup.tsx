import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
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
  type,
  isFileUploading,
}) => {
  const client = useQueryClient();
  const { setNewMsgGroup } = useFilters();
  const navigate = useNavigate();
  const formikContext = useFormikContext();
  const { mutate: updateMessage } = useMutation(SecureMessagesApi.updateNewGroupMessage, {
    onSuccess: () => {
      console.log("auto save success");
      // client.invalidateQueries([queryKeys.secureMessaging.id, `${id}`]).then(() => {});
      // client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {});
    },
  });
  const { mutate: postMessageGroup } = useMutation(SecureMessagesApi.postNewGroup, {
    onSuccess: (data) => {
      const route = reverse(`${constants.clientAccountRoutes.secureMessaging.inbox.id}`, {
        id: data.data?.id ?? data.data[0].id,
      });
      console.log("auto save success2");
      client.invalidateQueries([queryKeys.secureMessaging.fetch]).then(() => {
        setNewMsgGroup("draft");
        navigate(route);
      });
    },
  });
  const saveFormValues = (
    updateDraftMessageData: IUploadDraftMessage,
    draftMessageData: IUploadNewGroup,
    id: string
  ) => {
    //Check wether id is exits in params which indicats that current message is draft other wise user is about to create a message so save it as draft

    if (id) {
      const payload = updateDraftMessageData;
      console.log(type);
      console.log("update draft", payload);
      updateMessage({ message: payload, wrapper: type, id });
    } else {
      const payload = draftMessageData;
      console.log(type);
      console.log("first draft", payload);
      if (!payload.subject) return;
      postMessageGroup({ message: payload, wrapper: type });
    }
  };

  const debouncedHandleSaveValues = useMemo(() => debounce(saveFormValues, 2500), []);
  useEffect(() => {
    const equal = JSON.stringify(formikContext?.values) === JSON.stringify(initial);
    if (!equal && !isFileUploading) {
      debouncedHandleSaveValues(updateDraftMessageData, draftMessageData, id);
    }
  }, [formikContext?.values, isFileUploading]);

  return null;
};
