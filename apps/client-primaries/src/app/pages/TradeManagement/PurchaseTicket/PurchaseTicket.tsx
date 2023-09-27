import { FC } from "react";

import {
  Button,
  Property,
  PropertyKey,
  PropertyValue,
  Ticket,
  TicketContent,
  TicketFooter,
  TicketHeader,
  TicketProperties,
  TicketSecondaryTitle,
  TicketSummary,
  TicketText,
  TicketTitle,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useTradeManagementContext } from "../TradeManagement.provider";
import { IPurchaseTicketProps } from "./PurchaseTicket.types";

export const PurchaseTicket: FC<IPurchaseTicketProps> = (props) => {
  const { purchaseTicket, setPurchaseTicket, rejectPurchaseTicket, executePurchaseTicket } =
    ensureNotNull(useTradeManagementContext());

  return (
    <Ticket>
      <TicketHeader onClose={() => setPurchaseTicket()}>
        <TicketSecondaryTitle>{purchaseTicket?.name}</TicketSecondaryTitle>
      </TicketHeader>
      <TicketSummary>
        <TicketTitle>Purchase Ticket</TicketTitle>
        <TicketText>Please review the intended trade details.</TicketText>
      </TicketSummary>
      <TicketContent>
        <TicketProperties>
          <Property>
            <PropertyKey>Security</PropertyKey>
            <PropertyValue>{purchaseTicket?.security}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>ISIN</PropertyKey>
            <PropertyValue>{purchaseTicket?.isin}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Trade Identifier</PropertyKey>
            <PropertyValue>{purchaseTicket?.tradeIdentifier}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Certificates</PropertyKey>
            <PropertyValue>{purchaseTicket?.certificates}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Net Settlement Amt</PropertyKey>
            <PropertyValue>{purchaseTicket?.netSettlementAmount}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>SSI</PropertyKey>
            <PropertyValue>{purchaseTicket?.ssi}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Entity</PropertyKey>
            <PropertyValue>{purchaseTicket?.entity}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Entity ID</PropertyKey>
            <PropertyValue>{purchaseTicket?.entityId}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>[LEI]</PropertyKey>
            <PropertyValue>{purchaseTicket?.lei}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Trade Date</PropertyKey>
            <PropertyValue>{purchaseTicket?.tradeDate}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Settlement Date</PropertyKey>
            <PropertyValue>{purchaseTicket?.settlementDate}</PropertyValue>
          </Property>
        </TicketProperties>

        <TicketText>
          Disclaimer: By executing you enter into a binding trade with Emrgo DIFC as matched
          principal. Emrgo DIFC does not charge you a trade execution fee.
        </TicketText>
      </TicketContent>
      <TicketFooter>
        <Button size="large" variant="secondary" onClick={() => setPurchaseTicket()}>
          Close
        </Button>
        <Button
          size="large"
          variant="secondary"
          onClick={() => purchaseTicket && rejectPurchaseTicket(purchaseTicket.id)}
        >
          Reject
        </Button>
        <Button
          size="large"
          onClick={() => purchaseTicket && executePurchaseTicket(purchaseTicket.id)}
        >
          Execute
        </Button>
      </TicketFooter>
    </Ticket>
  );
};
