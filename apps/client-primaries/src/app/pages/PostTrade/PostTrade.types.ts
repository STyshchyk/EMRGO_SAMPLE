import { IIssuance } from "@emrgo-frontend/types";

export type TPendingSettlementStatus = "payment-pending" | "payment-received" | "failure";

export interface IPostTradeProps {}

export interface IPostTradeContext {
  pendingSettlement: IPendingSettlementIssuance[];
  custody: ICustodyIssuance[];
  viewPayment: (id: number) => void;
  viewCustody: (id: number) => void;
  downloadPaymentInstructionPdf: (id: number) => void;
  downloadPaymentInstructionCsv: (id: number) => void;
  paymentInstruction?: IPaymentInstruction;
  setPaymentInstruction: (instruction?: IPaymentInstruction) => void;
  downloadStandardSettlementInstructionPdf: (id: number) => void;
  downloadStandardSettlementInstructionCsv: (id: number) => void;
  standardSettlementInstruction?: IStandardSettlementInstruction;
  setStandardSettlementInstruction: (instruction?: IStandardSettlementInstruction) => void;
}

export interface IPendingSettlementIssuance extends IIssuance {
  custodian: string;
  // status: TPendingSettlementStatus;
}

export interface ICustodyIssuance extends IIssuance {
  custodian: string;
}

export interface IPaymentInstruction {
  id: number;
  security: string;
  settlementAmount: string;
  settlementDate: string;
  entity: string;
  currency: string;
  fullName: string;
  label: string;
  bankName: string;
  iban: string;
  swift: string;
  address: string;
  country: string;
  postCode: string;
  tradeIdentifier: string;
}

export interface IStandardSettlementInstruction {
  id: number;
  custodian: string;
  clientName: string;
  clientId: string;
  currency: string;
  subCustodian: string;
  subCustodianAC: string;
  entity: string;
  placeOfSettlement: string;
  swift: string;
  iban: string;
  address: string;
}
