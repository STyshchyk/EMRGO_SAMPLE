import { IBank, IIssuance, IOption } from "@emrgo-frontend/types";

import {
  TIssuanceType,
  TOpportunityStatus,
} from "../../components/PrimariesWrapper/PrimariesWrapper.types";

export type TFilterType = TIssuanceType | "";
export type TFilterStatus = TOpportunityStatus | "";

export interface ITradeOpportunitiesProps {}

export interface ITradeOpportunitiesContext {
  isAboutUsDisplayed: boolean;
  setIsAboutUsDisplayed: (isAboutUsDisplayed: boolean) => void;
  slides: IHeroSlide[];
  downloadData: () => void;
  investmentBanks: IBank[] | undefined;
  toggleIssuanceOnWatchlist: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: IOption | null;
  selectProductType: (type: IOption) => void;
  filterStatus: IOption | null;
  selectProductStatus: (status: IOption) => void;
  goToIssuanceDetails: (issuance: IIssuance, bankId: string) => void;
  productTypes?: IOption[];
  productStatus?: IOption[];
}

export interface IHeroSlide {
  title: string;
  description: string;
}
