import { FC } from "react";

import {
  Button,
  CsvIcon,
  PdfIcon,
  Property,
  PropertyKey,
  PropertyValue,
  Ticket,
  TicketAction,
  TicketContent,
  TicketFooter,
  TicketHeader,
  TicketProperties,
  TicketSummary,
  TicketText,
  TicketTitle,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { usePostTradeContext } from "../PostTrade.provider";
import { IStandardSettlementInstructionProps } from "./StandardSettlementInstruction.types";

export const StandardSettlementInstruction: FC<IStandardSettlementInstructionProps> = ({}) => {
  const {
    standardSettlementInstruction,
    setStandardSettlementInstruction,
    downloadStandardSettlementInstructionCsv,
    downloadStandardSettlementInstructionPdf,
  } = ensureNotNull(usePostTradeContext());

  return (
    <Ticket>
      <TicketHeader onClose={() => setStandardSettlementInstruction()}>
        <TicketTitle>Standard Settlement Instruction (SSI)</TicketTitle>
      </TicketHeader>
      <TicketSummary>
        <TicketText>
          Thank you for executing a trade for security [--]. Please use the SSIs below for
          settlement.
        </TicketText>
      </TicketSummary>
      <TicketContent>
        <TicketProperties>
          <Property>
            <PropertyKey>Custodian</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.custodian}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Client Name</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.clientName}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Client ID</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.clientId}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Currency</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.currency}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Sub-Custodian</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.subCustodian}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Sub-Custodian A/C</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.subCustodianAC}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Entity</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.entity}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Place of Settlement</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.placeOfSettlement}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>SWIFT/BIC</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.swift}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>IBAN</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.iban}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Address</PropertyKey>
            <PropertyValue>{standardSettlementInstruction?.address}</PropertyValue>
          </Property>
        </TicketProperties>
      </TicketContent>
      <TicketFooter>
        <TicketAction
          onClick={() =>
            standardSettlementInstruction &&
            downloadStandardSettlementInstructionPdf(standardSettlementInstruction.id)
          }
        >
          <PdfIcon />
        </TicketAction>
        <TicketAction
          onClick={() =>
            standardSettlementInstruction &&
            downloadStandardSettlementInstructionCsv(standardSettlementInstruction.id)
          }
        >
          <CsvIcon />
        </TicketAction>
        <Button size="large" onClick={() => setStandardSettlementInstruction()}>
          Close
        </Button>
      </TicketFooter>
    </Ticket>
  );
};
