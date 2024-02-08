import { IUploadNewGroup } from "@emrgo-frontend/types";

export interface ICreateNewMessageContainerProps {}
export interface IUploadnNewGroupInitialValuesProps extends IUploadNewGroup {
  isBrodcast: boolean;
  DeleteAttachmentIds: string[] | null;
  id?: string;
  isDraft?: boolean;
  lastTimeSavedDraft?: Date | null | string;
}
