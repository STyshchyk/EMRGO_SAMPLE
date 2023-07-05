import { dashboardApi } from "../../services/APIService";
import { IInvestmentBank, IOpportunityPayload, IOppotunityDocument } from "./AddOpportunityModal/AddOpportunity.types";

export interface IShownStatus {
  id?: string,
  status?: TShown
}

export enum TShown {
  show = "show",
  hide = "hide",
}


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


// TODO: Fix upload file
export const postOpportunityDocument = (data: { documentData: any, opportunityID: string }) => {
  return dashboardApi({
    method: "POST",
    url: `/v1/internal/opportunities/${data.opportunityID}/documents`,
    data: data.documentData
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

