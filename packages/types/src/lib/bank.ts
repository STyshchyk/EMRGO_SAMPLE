import { IIssuance } from "./issuance";

export interface ISellSide {
  id: string;
  name: string;
  logo: string;
  opportunities?: IIssuance[];
}

export interface IBank {
  bankId: string;
  name: string;
  logo: string;
  opportunities?: IIssuance[];
}
