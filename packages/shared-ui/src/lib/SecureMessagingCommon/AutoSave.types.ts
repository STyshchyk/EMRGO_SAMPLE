import { IUploadDraftMessage, IUploadMessageGroup, IUploadNewGroup } from "@emrgo-frontend/types";

import { IUploadnNewGroupInitialValuesProps } from "../SilverSecureMessaging/CreateNewMessageContainer/CreateNewMessageContainer.types";

export interface IAutoSaveGroupProps {
  initial: IUploadnNewGroupInitialValuesProps;
  updateDraftMessageData: IUploadDraftMessage;
  draftMessageData: IUploadNewGroup;
  id: string;
  isFileUploading: boolean;
}

export interface IAutoSaveGroupMessageProps {
  initial: IUploadMessageGroup;
  id: string | undefined;
  isFileUploading: boolean;
  isSubmitting: boolean;
}
