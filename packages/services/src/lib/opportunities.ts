import { IInvestmentBank, IOpportunityPayload, IOppotunityDocument, IShownStatus } from "@emrgo-frontend/types";
import { sharedDashboardApi } from "./silver.instance";

export interface IDataRoomDocument {
  "id": string,
  "lastUpdatedDate": string
  "name": string,
  "path": string,
  "type": string,
  "version": number
}

const dashboardApi = sharedDashboardApi;

export const getOppotunities = async (): Promise<IInvestmentBank[]> => {
  //FIXME: update api path once data is available
  const promise = dashboardApi({
    method: "GET",
    url: `/v1/internal/opportunities`
  });
  const data = await (await promise).data.data;
  return data || [];
};

export const postOpportunity = (payload: IOpportunityPayload) => {
  return dashboardApi({
    method: "POST",
    url: "/v1/internal/opportunities",
    data: payload
  });
};
export const updateOpportunity = (payload: IOpportunityPayload) => {
  return dashboardApi({
    method: "PUT",
    url: `/v1/internal/opportunities/${payload.id}`,
    data: payload
  });
};

export const getDataRoomDocuments = async (): Promise<IDataRoomDocument[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: "/v1/utils/internal/dataroom"
  });
  const res = await (await promise).data.data;
  return res || [];
};

export const updateDocument = async (file: { id: string, name: string, path: string }): Promise<any> => {
  return dashboardApi({
    method: "PUT",
    url: `/v1/utils/internal/dataroom/${file.id}`,
    data: {
      name: file.name,
      path: file.path
    }
  });
};

export const postDocument = async (document: { name: string, path: string }): Promise<any> => {
  return dashboardApi({
    method: "POST",
    url: `/v1/utils/internal/dataroom`,
    data: document
  });
};

export const postOpportunityDocument = async (document: { id: string, isPublic: boolean, name: string, path: string }) => {
  if (!document.id) return Promise.reject();
  return dashboardApi({
    method: "POST",
    url: `/v1/internal/opportunities/${document.id}/documents`,
    data: {
      name: document.name,
      isPublic: document.isPublic,
      path: document.path
    }

  });
};

export const deleteOpportunityDocument = async (document: { opportunityId: string, docId: string }) => {
  if (!document.opportunityId || !document.docId) return Promise.reject();
  return dashboardApi({
    method: "DELETE",
    url: `/v1/internal/opportunities/${document.opportunityId}/documents/${document.docId}`
  });
};


export const getOpportunityDocuments = async (id: string): Promise<IOppotunityDocument[]> => {
  const promise = dashboardApi({
    method: "GET",
    url: `/v1/internal/opportunities/${id}/documents`
  });
  const res = await (await promise).data.data;
  return res || [];
};


export const showOpportunity = (payload: IShownStatus) => {
  return dashboardApi({
    method: "PATCH",
    url: `/v1/internal/opportunities/${payload.id}/${payload.status}`
  });
};

