import { IIssuer } from "./issuer";

export interface IShownStatus {
  id?: string,
  status?: TShown
}

export enum TShown {
  show = "show",
  hide = "hide",
}
export interface IDataRoomDocument {
  "id": string,
  "lastUpdatedDate": string
  "name": string,
  "path": string,
  "type": string,
  "version": number
}
export interface IAddOpportunityModal {
  sellSide: string; //DropDown
  issuanceName: string;
  issuer: string; //DropDown
  issuerJurisdiction: string; //Auto
  industry: string; //Auto
  productType: string;
  tenor: string;
  currency: string; //DrowDown
  amount: string; //DD
  return: string; //DD
  CSD: string; //DD
  ISIN: string; //DD
  custody: string; //DD
}


export interface IInvestmentBank {
  bankId: string;
  name: string;
  logo: string;
  opportunities: IOpportunityFetch[];
}

export interface ICurrency {
  id: string;
  key?: string;
  name: string;
  nameAr: string;

}

export enum stage {
  true = "Open to all",
  false = "Cleint Questionare"
}

export interface IOppotunityDocument {
  id: string;
  name: string;
  objectName: string;
  opportunityId: string;
  updatedAt: string;
  isPublic: stage;
  url: string;
}

export interface IId {
  id?: string;
}


export interface IOpportunityFetch extends IId, IOpportunityPayload {
  timeLeft: string;
  isShown: boolean;
  wethaqId: string | null;
  currency: ICurrency;
  documents: IOppotunityDocument[] | null;
  status: ICurrency | null;
  type: ICurrency | null;
  issuer: IIssuer;
  isWatched: boolean;
  statusId?: string;


}

export enum opStatus {
  idea = "399a5c48-299c-4ffe-8d49-5756f0e373cf",
  open = "c9d9a6ce-bdea-4e45-80bd-2b783b48adf3",
  closed = "13df62f8-393d-4e1b-a592-ae1f701ad39f",

}

export interface IOpportunityPayload extends IId {
  name: string;
  sellSideOrganisation: string;
  issuerId: string;
  productType: string;
  productDetails: string;
  tenor: number | null;
  currencyId: string;
  amount: number;
  return: number;
  isin: string;
  csd: string;
  custody: string;
  industryId: string | null;
  typeId: string;
  offerPeriodEnd: string;
  preOfferPeriodEnd: string;
  redemptionDate: string;
  issueDate: string;
  ideaEnd: string;
  openEnd: string;


}


