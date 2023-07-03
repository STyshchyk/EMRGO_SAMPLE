import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../Button";
import { CsvIcon, PdfIcon } from "../Icon";
import { Property, PropertyKey, PropertyValue } from "../Properties";
import { Ticket } from "./Ticket";
import { TicketAction } from "./TicketAction";
import { TicketContent } from "./TicketContent";
import { TicketFooter } from "./TicketFooter";
import { TicketHeader } from "./TicketHeader";
import { TicketProperties } from "./TicketProperties";
import { TicketSecondaryTitle } from "./TicketSecondaryTitle";
import { TicketSummary } from "./TicketSummary";
import { TicketText } from "./TicketText";
import { TicketTitle } from "./TicketTitle";

const meta: Meta<typeof Ticket> = {
  title: "Ticket",
  component: Ticket,
  decorators: [
    (Story) => (
      <div style={{ display: "grid", height: 600 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Ticket>;

export const PurchaseTicket: Story = {
  args: {
    children: (
      <>
        <TicketHeader>
          <TicketSecondaryTitle>Elefant Capital</TicketSecondaryTitle>
        </TicketHeader>
        <TicketSummary>
          <TicketTitle>Purchase Ticket</TicketTitle>
          <TicketText>Please review the intended trade details.</TicketText>
        </TicketSummary>
        <TicketContent>
          <TicketProperties>
            <Property>
              <PropertyKey>Security</PropertyKey>
              <PropertyValue>Green Sukuk 2.5 2035</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>ISIN</PropertyKey>
              <PropertyValue>USD</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Trade Identifier</PropertyKey>
              <PropertyValue>EMGO3546273-S</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Certificates</PropertyKey>
              <PropertyValue>100</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Net Settlement Amt</PropertyKey>
              <PropertyValue>985,421</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>SSI</PropertyKey>
              <PropertyValue>Main USD Account</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Entity</PropertyKey>
              <PropertyValue>Bank B</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Entity ID</PropertyKey>
              <PropertyValue>678912345</PropertyValue>
            </Property>
            <Property>
              <PropertyKey>[LEI]</PropertyKey>
              <PropertyValue>123456789WERTYU</PropertyValue>
            </Property>
            <Property>
              <PropertyKey>Trade Date</PropertyKey>
              <PropertyValue>02/05/2021</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Settlement Date</PropertyKey>
              <PropertyValue>04/05/2021</PropertyValue>
            </Property>
          </TicketProperties>
          <TicketText>
            Disclaimer: By executing you enter into a binding trade with Emergo DIFC as matched
            principal. Emergo DIFC does not charge you a trade execution fee.
          </TicketText>
        </TicketContent>
        <TicketFooter>
          <Button size="large" variant="secondary">
            Close
          </Button>
          <Button size="large" variant="secondary">
            Reject
          </Button>
          <Button size="large">Execute</Button>
        </TicketFooter>
      </>
    ),
  },
};

export const PaymentInstructions: Story = {
  args: {
    children: (
      <>
        <TicketHeader>
          <TicketTitle>Payment Instructions</TicketTitle>
        </TicketHeader>
        <TicketSummary>
          <TicketText>Thank you for executing a trade for &#123;security&#125;.</TicketText>
          <TicketText>
            Please arrange to remit the &#123;settlement_amount&#125; for
            &#123;settlement_date&#125; to our client account for settlement.
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
              <PropertyValue>BROKER 1</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Currency</PropertyKey>
              <PropertyValue>USD</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Full Name</PropertyKey>
              <PropertyValue>Bilal Mohammed</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Label</PropertyKey>
              <PropertyValue>Client Omnibus Account</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Bank Name</PropertyKey>
              <PropertyValue>ENBD</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>IBAN</PropertyKey>
              <PropertyValue>AE000000123456789</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>SWIFT / BIC</PropertyKey>
              <PropertyValue>BANKRFES</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Address</PropertyKey>
              <PropertyValue>Sheikh Zayed Road</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Country</PropertyKey>
              <PropertyValue>UAE</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Post Code</PropertyKey>
              <PropertyValue>73847</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Trade Identifier</PropertyKey>
              <PropertyValue>EMGO3546273</PropertyValue>
            </Property>
          </TicketProperties>

          <TicketText>
            A copy of this Payment Instruction has been sent to your registered email address.
          </TicketText>
        </TicketContent>
        <TicketFooter>
          <TicketAction>
            <PdfIcon />
          </TicketAction>
          <TicketAction>
            <CsvIcon />
          </TicketAction>
          <Button size="large">Close</Button>
        </TicketFooter>
      </>
    ),
  },
};

export const StandardSettlementInstruction: Story = {
  args: {
    children: (
      <>
        <TicketHeader>
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
              <PropertyValue>EMERGO DIFC</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Client Name</PropertyKey>
              <PropertyValue>EFG-Hermes FI Ltd</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Client ID</PropertyKey>
              <PropertyValue>EFG</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Currency</PropertyKey>
              <PropertyValue>USD</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Sub-Custodian</PropertyKey>
              <PropertyValue>EUROCLEAR BANK</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Sub-Custodian A/C</PropertyKey>
              <PropertyValue>44382</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Entity</PropertyKey>
              <PropertyValue>Bank B</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Place of Settlement</PropertyKey>
              <PropertyValue>MGTCBEBEECL</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>SWIFT/BIC</PropertyKey>
              <PropertyValue>EBILAEAD</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>IBAN</PropertyKey>
              <PropertyValue>AE850245001025641660398</PropertyValue>
            </Property>

            <Property>
              <PropertyKey>Address</PropertyKey>
              <PropertyValue>EMIRATES NBD BANK PJSC, Dubai</PropertyValue>
            </Property>
          </TicketProperties>
        </TicketContent>
        <TicketFooter>
          <TicketAction>
            <PdfIcon />
          </TicketAction>
          <TicketAction>
            <CsvIcon />
          </TicketAction>
          <Button size="large">Close</Button>
        </TicketFooter>
      </>
    ),
  },
};
