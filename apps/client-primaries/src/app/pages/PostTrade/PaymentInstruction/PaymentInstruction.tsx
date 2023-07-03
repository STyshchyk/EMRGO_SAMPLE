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
import { IPaymentInstructionProps } from "./PaymentInstruction.types";

export const PaymentInstruction: FC<IPaymentInstructionProps> = (props) => {
  const {
    paymentInstruction,
    setPaymentInstruction,
    downloadPaymentInstructionCsv,
    downloadPaymentInstructionPdf,
  } = ensureNotNull(usePostTradeContext());

  return (
    <Ticket>
      <TicketHeader onClose={() => setPaymentInstruction()}>
        <TicketTitle>Payment Instructions</TicketTitle>
      </TicketHeader>
      <TicketSummary>
        <TicketText>Thank you for executing a trade for {paymentInstruction?.security}.</TicketText>
        <TicketText>
          Please arrange to remit the {paymentInstruction?.settlementAmount} for{" "}
          {paymentInstruction?.settlementDate} to our client account for settlement.
        </TicketText>
        <TicketText>
          This amount should be received in free and available funds into our client money account
          net (from bank, currency conversion and any other charges) or your trade settlement will
          fail.
        </TicketText>
      </TicketSummary>
      <TicketContent>
        <TicketProperties>
          <Property>
            <PropertyKey>Entity</PropertyKey>
            <PropertyValue>{paymentInstruction?.entity}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Currency</PropertyKey>
            <PropertyValue>{paymentInstruction?.currency}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Full Name</PropertyKey>
            <PropertyValue>{paymentInstruction?.fullName}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Label</PropertyKey>
            <PropertyValue>{paymentInstruction?.label}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Bank Name</PropertyKey>
            <PropertyValue>{paymentInstruction?.bankName}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>IBAN</PropertyKey>
            <PropertyValue>{paymentInstruction?.iban}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>SWIFT / BIC</PropertyKey>
            <PropertyValue>{paymentInstruction?.swift}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Address</PropertyKey>
            <PropertyValue>{paymentInstruction?.address}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Country</PropertyKey>
            <PropertyValue>{paymentInstruction?.country}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Post Code</PropertyKey>
            <PropertyValue>{paymentInstruction?.postCode}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Trade Identifier</PropertyKey>
            <PropertyValue>{paymentInstruction?.tradeIdentifier}</PropertyValue>
          </Property>
        </TicketProperties>

        <TicketText>
          A copy of this Payment Instruction has been sent to your registered email address.
        </TicketText>
      </TicketContent>
      <TicketFooter>
        <TicketAction
          onClick={() => paymentInstruction && downloadPaymentInstructionPdf(paymentInstruction.id)}
        >
          <PdfIcon />
        </TicketAction>
        <TicketAction
          onClick={() => paymentInstruction && downloadPaymentInstructionCsv(paymentInstruction.id)}
        >
          <CsvIcon />
        </TicketAction>
        <Button size="large" onClick={() => setPaymentInstruction()}>
          Close
        </Button>
      </TicketFooter>
    </Ticket>
  );
};
