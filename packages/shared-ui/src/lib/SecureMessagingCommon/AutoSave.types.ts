import {
  IUploadDraftMessage,
  IUploadMessageGroup,
  IUploadNewGroup,
  TWrapperType,
} from "@emrgo-frontend/types";

import { IUploadnNewGroupInitialValuesProps } from "../SilverSecureMessaging/CreateNewMessageContainer/CreateNewMessageContainer.types";

export interface IAutoSaveGroupProps {
  initial: IUploadnNewGroupInitialValuesProps;
  updateDraftMessageData: IUploadDraftMessage;
  draftMessageData: IUploadNewGroup;
  id: string;
  type: TWrapperType;
  isFileUploading: boolean;
}

export interface IAutoSaveGroupMessageProps {
  initial: IUploadMessageGroup;
  id: string;
  type: TWrapperType;
  isFileUploading: boolean;
}
