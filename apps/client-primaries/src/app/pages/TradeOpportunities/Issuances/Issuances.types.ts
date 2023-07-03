import { IBank, IDropdown, IIssuance } from "@emrgo-frontend/types";

import { TFilterStatus, TFilterType } from "../TradeOpportunities.types";

export interface IIssuancesProps {}

export interface IIssuancesContext {
  data?: IBank;
  toggleIssuanceOnWatchlist: (id: string) => void;
  searchQuery: string;
  downloadData: () => void;
  setSearchQuery: (query: string) => void;
  filterType: TFilterType;
  selectProductType: (type: TFilterType) => void;
  filterStatus: TFilterStatus;
  selectProductStatus: (status: TFilterStatus) => void;
  goToIssuanceDetails: (issuance: IIssuance, bankId: string) => void;
  productTypes?: IDropdown[];
  productStatus?: IDropdown[];
}
