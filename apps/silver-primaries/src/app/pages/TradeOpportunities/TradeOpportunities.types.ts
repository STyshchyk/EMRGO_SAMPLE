import { TIssuanceType, TOpportunityStatus } from "../Primaries.types";
import { IInvestmentBank } from "./AddOpportunityModal/AddOpportunity.types";

export type TFilterType = TIssuanceType | "all-types";
export type TFilterStatus = TOpportunityStatus | "all-statuses";

export interface ITradeOpportunitiesProps {
}

export interface ITradeOpportunitiesContext {
  isAboutUsDisplayed: boolean;
  setIsAboutUsDisplayed: (isAboutUsDisplayed: boolean) => void;
  downloadData: () => void;
  data?: IInvestmentBank[];
  toggleIssuanceOnWatchlist: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: TFilterType;
  setFilterType: (type: TFilterType) => void;
  filterStatus: TFilterStatus;
  setFilterStatus: (status: TFilterStatus) => void;
}

export interface IHeroSlide {
  title: string;
  description: string;
}


