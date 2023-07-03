import { IStandardSettlementInstruction } from "../PostTrade.types";

const standardSettlementInstruction: IStandardSettlementInstruction = {
  id: 1,
  custodian: "EMERGO DIFC",
  clientName: "EFG-Hermes FI Ltd",
  clientId: "EFG",
  currency: "USD",
  subCustodian: "EUROCLEAR BANK",
  subCustodianAC: "44382",
  entity: "Bank B",
  placeOfSettlement: "MGTCBEBEECL",
  swift: "EBILAEAD",
  iban: "AE850245001025641660398",
  address: "EMIRATES NBD BANK PJSC, Dubai",
};

export default standardSettlementInstruction;
