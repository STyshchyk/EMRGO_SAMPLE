import { TUserType } from "@emrgo-frontend/shared-ui";

import { IEntity } from "./silver.entities";

export interface IFetchGroupsProps {
  wrapper: TWrapperType;
}

export interface IFetchGroupMessagesIdProps {
  wrapper: TWrapperType;
  id: string;
}

export interface IUsePostReadMessagesProps {
  wrapper: TWrapperType;
  payload: {
    groupId?: string;
    messageIds?: string[];
  };
}

export interface IUploadDraftMessage {
  label: string;
  message: string;
  subject: string;
  isFlagged: boolean;
  groupStatus: "Sent" | "Draft";
  addAttachments: IUploadAttachemnt[] | null;
  DeleteAttachmentIds?: string[] | undefined | null;
  creatorEntity?: string[] | undefined;
  creatorEntities?: string[] | undefined;
}

export interface IDeleteGroupProps {
  wrapper: TWrapperType;
  id: string;
}

export interface IUpdateFlagProps {
  wrapper: TWrapperType;
  id: string;
  status: "on" | "off";
}

export interface IUpdateNewGroupMessageProps {
  message: IUploadDraftMessage;
  wrapper: TWrapperType;
  id: string;
}

export interface IUploadAttachemnt {
  url: string;
  fileName: string;
  size?: string;
  isLoading?: boolean;
  id?: string;
}

export interface IUploadNewGroup {
  attachments: IUploadAttachemnt[] | null;
  creatorEntities?: IEntity[] | string[] | null | string;
  groupStatus: "Sent" | "Draft";
  isFlagged: boolean;
  label: string;
  message: string;
  subject: string;
}

export interface IUploadMessageGroup {
  addAttachments: IUploadAttachemnt[];
  groupId?: string;
  status: TMessageStatus;
  message: string;
  messageId?: string | null;
  DeleteAttachmentIds: [];
  isDraft?: boolean;
  lastTimeSavedDraft?: Date | null;
}

export interface IPostNewGroupProps {
  message: IUploadNewGroup;
  wrapper: TWrapperType;
}

export interface IPostGroupMessageProps {
  message: IUploadMessageGroup;
  wrapper: TWrapperType;
  id?: string;
}

export interface IUpdateGroupMessage {
  groupId: string;
  message: string;
  messageId?: string;
  status: TMessageStatus;
  addAttachments: IUploadAttachemnt[];
  DeleteAttachmentIds?: string[];
}

export interface IUpdateGroupMessageProps {
  wrapper: TWrapperType;
  id: string;
  message: IUpdateGroupMessage;
}

export interface ICreator {
  email: string;
  entityId: string;
  firstName: string;
  lastName: string;
  type: TUserType;
  kycVerified: boolean;
}

export interface IMessageChain {
  id: string;
  groupId: string;
  senderId: string;
  senderEntityId: string;
  entityType: TUserType;
  message: string;
  sender: ICreator;
  isNew: boolean;
  isNewStarted: boolean;
  linkStatus: TMessageStatus;
  index: number;
  createdAt: Date;
  updatedAt: Date;
  sentAt: Date;
  attachments: IUploadAttachemnt[];
}

export interface IMessageData {
  id: string;
  chain: IMessageChain[];
  creator: ICreator;
  creatorEntityId: string;
  creatorId: string;
  entities: IEntity;
  entityType: TUserType;
  externalStatus: string;
  internalStatus: string;
  groupStatus: TMessageStatus;
  id: string;
  isFlagged: boolean;
  label_id: string;
  label: { value: string; id: string; label: string };
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt: Date;
}

export interface IGroups {
  id: string;
  label_id: string;
  label: { value: string; id: string; label: string };
  creatorEntityId: string;
  creatorId: string;
  creator: IEntity;
  unread: { newExternal: number; newInternal: number; groupId: string };
  creatorEntities: string[] | string;
  externalStatus: string;
  internalStatus: string;
  entityType: TWrapperType;
  subject: string;
  groupStatus: TMessageStatus;
  isFlagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TWrapperType = "client" | "internal";
export type TMessageStatus = "Sent" | "Draft";
