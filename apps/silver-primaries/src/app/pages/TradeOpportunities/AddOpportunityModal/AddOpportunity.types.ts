import { IIssuer } from "../ManageIssuers/ManageIssuers.types";

export interface IAddOpportunityProps {}

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

enum stage {
  true = "Open to all",
  false = "Cleint Questionare",
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

// export interface IOpportunity extends IId {
//   csd?: string;
//   currencyId?: ICurrencyID | null | string;
//   custody?: ICustody | null | string;
//   watchlist?: IOpportunityWatchList | null | string;
//   wethaqId?: IOpportunityWethaq | null | string;
//   currency?: ICurrency | null | string;
//   documents: IOppotunityDocument[] | null;
//   status?: IOpportunityStatus | null;
//   type?: IOpportunityType | null;
//   issuer: IIssuer;
//   sellSide: ISellside;
//
//   amount: number | null;
//   isWatched: boolean;
//   isin: string;
//   issuerId: string;
//   name: string;
//   offerPeriodEnd: string;
//   preOfferPeriodEnd: string;
//   redemptionDate: string;
//   issueDate: string;
//
//   productDetails: string;
//   productType: string;
//   return: number;
//   sellSideOrganisation: string;
//   statusId: string;
//   tenor: number | null;
//   timeLeft: string;
//   typeId: string;
//   isShown: boolean;
//   ideaEnd: string;
//   openEnd: string;
//
// }

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
