import { IEntity } from "./silver.entities";

export interface IFetchGroupsProps {
  wrapper: TWrapperType;
}

export interface IFetchAuditHistoryProps {
  wrapper: TWrapperType | null;
  groupId: string;
}

export interface IAudit {
  changedBy: string;
  createdAt: Date | string | null;
  entityType: TWrapperType;
  groupId: string;
  id: string;
  newStatus: TGroupStatus | "Reopened";
  oldStatus: TGroupStatus | "Reopened";
  changedByUser: {
    email: string;
    id: string;
    entityId: string;
    firstName: string;
    lastName: string;
    type: TWrapperType;
    kycVerified: boolean;
  };
}

export interface ISecureAudit {
  external: ISecureAudit[] | null;
  internal: ISecureAudit[] | null;
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
  wrapper: TWrapperType | null;
  id: string;
}

export interface IUpdateFlagProps {
  wrapper: TWrapperType | null;
  id: string;
  status: "on" | "off";
}

export interface IUpdateGroupStatusProps {
  wrapper: TWrapperType;
  status: TGroupStatus;
  id: string;
}

export interface IUpdateNewGroupMessageProps {
  message: IUploadDraftMessage;
  wrapper: TWrapperType | null;
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
  attachments: IUploadAttachemnt[] | null | undefined;
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
  lastTimeSavedDraft?: Date | string | null;
}

export interface IPostNewGroupProps {
  message: IUploadNewGroup;
  wrapper: TWrapperType | null;
}

export interface IPostGroupMessageProps {
  message: IUploadMessageGroup;
  wrapper: TWrapperType | null;
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
  wrapper: TWrapperType | null;
  id: string;
  message: IUpdateGroupMessage;
}

export interface ICreator {
  email: string;
  entityId: string;
  firstName: string;
  lastName: string;
  type: TWrapperType;
  kycVerified: boolean;
}

export interface IMessageChain {
  id: string;
  groupId: string;
  senderId: string;
  senderEntityId: string;
  entityType: TWrapperType;
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
  entityType: TWrapperType;
  externalStatus: string;
  internalStatus: string;
  groupStatus: TMessageStatus | "Archived";
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
  isNew?: boolean;
  subject: string;
  groupStatus: TMessageStatus;
  isFlagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TWrapperType = "client" | "internal";
export type TMessageStatus = "Sent" | "Draft";
export type TGroupStatus = "New" | "InProgress" | "Closed";

export const GroupOptions: { label: string; value: TGroupStatus }[] = [
  { label: "In Progress", value: "InProgress" },
  { label: "New", value: "New" },
  { label: "Closed", value: "Closed" },
];

export const GroupOptions2: { label: string; value: TGroupStatus }[] = [
  { label: "In Progress", value: "InProgress" },
  { label: "Closed", value: "Closed" },
];
