import { ISellSide } from "./bank";
import { IDocument } from "./documents";
import { IDropdown, IDropdownJoin } from "./dropdowns";
import { IIssuer } from "./issuer";

export interface IIssuance {
  id: string;
  name: string;
  sellSideOrganisation: string;
  isin: string;
  statusId: string;
  status?: IDropdownJoin;
  productType: string;
  productDetails: string;
  csd: string;
  custody: string;
  issuerId: string;
  typeId: string;
  type: IDropdownJoin;
  currencyId: string;
  amount: number;
  return: number;
  tenor: number;
  wethaqId: null;
  preOfferPeriodEnd: string;
  offerPeriodEnd: string;
  issueDate: string;
  redemptionDate: string;
  timeLeft: string;
  isShown: boolean;
  isWatched: boolean;
  currency: IDropdownJoin;
  issuer: IIssuer;
  documents: IDocument[];
  sellSide: ISellSide;
}
