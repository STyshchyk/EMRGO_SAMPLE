import {
  IDeleteGroupProps,
  IFetchAuditHistoryProps,
  IFetchGroupMessagesIdProps,
  IFetchGroupsProps,
  IGroups,
  IMessageData,
  IPostGroupMessageProps,
  IPostNewGroupProps,
  ISecureAudit,
  IUpdateFlagProps,
  IUpdateGroupMessageProps,
  IUpdateGroupStatusProps,
  IUpdateNewGroupMessageProps,
  IUsePostReadMessagesProps,
} from "@emrgo-frontend/types";

import { sharedDashboardApi } from "./instances";
import { sharedSilverDashboardApi } from "./silver.instance";

const sharedSilver = sharedSilverDashboardApi;
const sharedClient = sharedDashboardApi;

export const fetchGroups = async (props: IFetchGroupsProps): Promise<IGroups[]> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "get",
    url: `/messaging/v1/groups`,
    params: {
      isArchived: true,
    },
  });
  const data = await (await promise).data.data;
  return data || [];
};
export const fetchAuditHistory = async (props: IFetchAuditHistoryProps): Promise<ISecureAudit> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "get",
    url: `messaging/v1/groups/${props.groupId}/audit`,
  });
  const data = await (await promise).data.data;
  return data || [];
};

export const fetchGroupMessagesId = async (
  props: IFetchGroupMessagesIdProps
): Promise<IMessageData> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "get",
    url: `/messaging/v1/groups/${props.id}`,
  });
  const data = await (await promise).data.data;
  return data || [];
};

export const usePostReadMessages = async (
  props: IUsePostReadMessagesProps
): Promise<IMessageData> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "post",
    url: `/messaging/v1/message/read`,
    data: props.payload,
  });
  const data = await (await promise).data.data;
  return data || [];
};

export const deleteGroup = async (props: IDeleteGroupProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "delete",
    url: `/messaging/v1/group/${props.id}`,
  });
  const data = await (await promise).data;
  return data || [];
};
export const deleteMessage = async (props: IDeleteGroupProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "delete",
    url: `/messaging/v1/message/${props.id}`,
  });
  const data = await (await promise).data;
  return data || [];
};

export const updateFlag = async (props: IUpdateFlagProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "patch",
    url: `/messaging/v1/group/${props.id}/flagged/${props.status}`,
  });
  const data = await (await promise).data;
  return data || [];
};

export const updateGroupStatus = async (props: IUpdateGroupStatusProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "patch",
    url: `/messaging/v1/group/${props.groupId}/status/${props.status}`,
  });
  const data = await (await promise).data;
  return data || [];
};
// /messaging/v1/group/{id}/flagged/{status}
export const updateNewGroupMessage = async (props: IUpdateNewGroupMessageProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "put",
    url: `/messaging/v1/groups/${props.id}`,
    data: props.message,
  });
  const data = await (await promise).data;
  return data || [];
};

export const postNewGroup = async (props: IPostNewGroupProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "post",
    url: `/messaging/v1/${props.wrapper}/groups`,
    data: props.message,
  });
  const data = await (await promise).data;
  return data || [];
};

export const postGroupMessage = async (props: IPostGroupMessageProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "post",
    url: `/messaging/v1/message`,
    data: props.message,
  });
  const data = await (await promise).data;
  return data || [];
};

export const updateGroupMessage = async (props: IUpdateGroupMessageProps): Promise<any> => {
  const sharedApi = props.wrapper === "client" ? sharedClient : sharedSilver;
  const promise = sharedApi({
    method: "put",
    url: `/messaging/v1/message/${props.id}`,
    data: props.message,
  });
  const data = await (await promise).data;
  return data || [];
};

const SecureMessaging = {
  fetchGroups,
  fetchGroupMessagesId,
  fetchAuditHistory,
  deleteGroup,
  deleteMessage,
  updateFlag,
  updateGroupMessage,
  updateGroupStatus,
  updateNewGroupMessage,
  postNewGroup,
  usePostReadMessages,
  postGroupMessage,
};

export default SecureMessaging;
