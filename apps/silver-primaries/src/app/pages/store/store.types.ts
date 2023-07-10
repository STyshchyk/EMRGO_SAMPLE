import {IInvestmentBank, IOpportunityFetch} from "../TradeOpportunities/AddOpportunityModal/AddOpportunity.types";
import {IIssuer} from "../TradeOpportunities/ManageIssuers/ManageIssuers.types";
import {ISellside} from "../TradeOpportunities/ManageSellside/ManageSellside.types";

export interface IIssuerStore {
  issuerData: IIssuer[] | [];
  issuerAction: {
    setIsssuer: (data: IIssuer[] | []) => void;
  };
}

export interface ICurrency {
  id: string;
  name: string;
  nameAr: string;
  label: string;
  region: string;
  value: string | null;
  metadata: string | null;
  order: string | null;
  key: string | null;
  parentId: string;
  active: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICurrencyStore {
  currencyData: ICurrency[] | [];
  custodyData: ICurrency[] | [];
  industryData: ICurrency[] | [];
  csdData: ICurrency[] | [];
  currencyAction: {
    setCurrency: (data: ICurrency[] | []) => void;
    setCustody: (data: ICurrency[] | []) => void;
    setIndustry: (data: ICurrency[] | []) => void;
    setCDS: (data: ICurrency[] | []) => void;
  };
}

export interface IOpportunityStore {
  opportunityData: IInvestmentBank[] | [];
  opportunityDocs: IOpportunityFetch | null;
  opportunityAction: {
    setOpportunity: (data: IInvestmentBank[] | []) => void;
    setOpportunityDocs: (data: IOpportunityFetch | null) => void;
  };
}

export interface ISellSideStore {
  sellSideData: ISellside[] | [];
  sellSideActions: {
    setSellSite: (data: ISellside[] | null) => void;
  };
}

export interface IModal<T> {
  isModalOpen: boolean;
  opportunityData?: IOpportunityFetch | null,
  modifyData?: T | null;
  modalActions: {
    setModifyData?: (data: T) => void;
    setOpportunityData?: (opp?: IOpportunityFetch | null) => void;
    deleteModifyData?: () => void;
    setModalOpen: (flag: boolean) => void;
  };
}
