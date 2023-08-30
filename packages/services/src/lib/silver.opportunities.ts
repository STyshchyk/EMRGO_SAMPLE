import {
  IDataRoomDocument,
  IInvestmentBank,
  IOpportunityPayload,
  IOppotunityDocument,
  IShownStatus,
  ITradeInterestPayload,
} from "@emrgo-frontend/types";

import { sharedSilverDashboardApi } from "./silver.instance";

export const getOppotunities = async (): Promise<IInvestmentBank[]> => {
  //FIXME: update api path once data is available
  const promise = sharedSilverDashboardApi({
    method: "GET",
    url: `/opp/v1/internal/opportunities`,
  });
  const data = await (await promise).data.data;
  return data || [];
};
export const getTradeInterests = async (id: string | undefined): Promise<any> => {
  //FIXME: update api path once data is available
  if (id === undefined) return Promise.reject();
  const promise = sharedSilverDashboardApi({
    method: "GET",
    url: `/opp/v1/internal/opportunities/${id}/participates`,
  });
  return promise;
};

export const postTradeInterest = async (tradeInterest: ITradeInterestPayload) => {
  return sharedSilverDashboardApi({
    method: "POST",
    url: `/opp/v1/internal/participating`,
    data: tradeInterest,
  });
};

export const postOpportunity = (payload: IOpportunityPayload) => {
  return sharedSilverDashboardApi({
    method: "POST",
    url: "/opp/v1/internal/opportunities",
    data: payload,
  });
};
export const updateOpportunity = (payload: IOpportunityPayload) => {
  return sharedSilverDashboardApi({
    method: "PUT",
    url: `/opp/v1/internal/opportunities/${payload.id}`,
    data: payload,
  });
};

export const getDataRoomDocuments = async (): Promise<IDataRoomDocument[]> => {
  const promise = sharedSilverDashboardApi({
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
  return sharedSilverDashboardApi({
    method: "PUT",
    url: `/utils/v1/utils/internal/dataroom/${file.id}`,
    data: {
      name: file.name,
      path: file.path,
    },
  });
};

export const postDocument = async (document: { name: string; path: string }): Promise<any> => {
  return sharedSilverDashboardApi({
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
  return sharedSilverDashboardApi({
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
  return sharedSilverDashboardApi({
    method: "DELETE",
    url: `/opp/v1/internal/opportunities/${document.opportunityId}/documents/${document.docId}`,
  });
};

export const getOpportunityDocuments = async (id: string): Promise<IOppotunityDocument[]> => {
  const promise = sharedSilverDashboardApi({
    method: "GET",
    url: `/opp/v1/internal/opportunities/${id}/documents`,
  });
  const res = await (await promise).data.data;
  return res || [];
};

export const showOpportunity = (payload: IShownStatus) => {
  return sharedSilverDashboardApi({
    method: "PATCH",
    url: `/opp/v1/internal/opportunities/${payload.id}/${payload.status}`,
  });
};
