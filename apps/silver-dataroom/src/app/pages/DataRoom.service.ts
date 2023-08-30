import { dashboardApi } from "../services/APIService";
import { IDataRoomDocument } from "./DataRoom.types";

export const getDataRoomDocuments = async (): Promise<IDataRoomDocument[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: "/utils/v1/utils/internal/dataroom",
  });
  const res = await (await promise).data.data;
  return res || [];
};

export const updateDocument = async (file: {
  id: string;
  name: string;
  path: string;
}): Promise<any> => {
  return dashboardApi({
    method: "PUT",
    url: `/utils/v1/utils/internal/dataroom/${file.id}`,
    data: {
      name: file.name,
      path: file.path,
    },
  });
};
//TODO : FIX THIS
export const getOppotunities = async (): Promise<any[]> => {
  //FIXME: update api path once data is available
  const promise = dashboardApi({
    method: "GET",
    url: `/opp/v1/internal/opportunities`,
  });
  const data = await (await promise).data.data;
  return data || [];
};
export const postDocument = async (document: { name: string; path: string }): Promise<any> => {
  return dashboardApi({
    method: "POST",
    url: `/utils/v1/utils/internal/dataroom`,
    data: document,
  });
};

export const postOpportunityDocument = async (document: {
  id: string;
  isPublic: boolean;
  name: string;
  path: string;
}) => {
  if (!document.id) return Promise.reject();
  return dashboardApi({
    method: "POST",
    url: `/opp/v1/internal/opportunities/${document.id}/documents`,
    data: {
      name: document.name,
      isPublic: document.isPublic,
      path: document.path,
    },
  });
};

export const deleteOpportunityDocument = async (document: {
  opportunityId: string;
  docId: string;
}) => {
  if (!document.opportunityId || !document.docId) return Promise.reject();
  return dashboardApi({
    method: "DELETE",
    url: `/opp/v1/internal/opportunities/${document.opportunityId}/documents/${document.docId}`,
  });
};
