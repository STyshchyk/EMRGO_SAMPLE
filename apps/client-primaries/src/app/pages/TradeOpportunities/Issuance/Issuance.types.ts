import { IDocument, IIssuance } from "@emrgo-frontend/types";

export interface IIssuanceProps {}

export interface IIssuanceContext {
  issuance?: IIssuance;
  documents: IDocument[];
  totalNumberOfDocuments: number;
  toggleIssuanceOnWatchlist: () => void;
  addToCalendar: () => void;
  contactRM: () => void;
  handleTradeExecutionClick: (type: string) => void;
}
