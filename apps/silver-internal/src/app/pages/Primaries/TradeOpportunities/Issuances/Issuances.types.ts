import { IBank } from "../TradeOpportunities.types";

export interface IIssuancesProps {}

export interface IIssuancesContext {
  data?: IBank;
  toggleIssuanceOnWatchlist: (id: number) => void;
}
